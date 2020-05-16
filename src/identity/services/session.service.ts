import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as Redis from 'ioredis';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import jwt from 'jsonwebtoken';
import { RedisService } from 'nestjs-redis';
import Config from 'src/config';
import { SessionDto } from 'src/dto';
import { SessionModel, UserModel } from '../models';


@Injectable()
export class SessionService {
    public constructor(
        @InjectModel(UserModel) private readonly userModel: ReturnModelType<typeof UserModel>,
        @InjectModel(SessionModel) private readonly sessionModel: ReturnModelType<typeof SessionModel>,
        @Inject(RedisService) private readonly redisService: RedisService,
    ) {
    }


    private async getRedisClient(): Promise<Redis.Redis> {
        return this.redisService.getClient();
    }


    protected generateJWTToken(user: UserModel): string {
        return jwt.sign({
            sub: user.uuid,
            email: user.email,
            scopes: [
                '/documents',
                '/styles',
            ],
        }, Config.JWTSecret);
    }


    public async creteSession(user: UserModel, additionData: object): Promise<SessionDto> {
        const jwtToken = this.generateJWTToken(user);
        const sessionDto = SessionDto.generate();

        await this.storeSession(sessionDto, jwtToken);

        const newSession = new this.sessionModel({
            ...sessionDto.forModel(),
            userId: user.uuid,
            metadata: additionData,
        });
        await newSession.save();

        return sessionDto;
    }


    public async getUserBySession(session: SessionModel): Promise<UserModel> {
        return await this.userModel.findOne({ uuid: session.userId }).exec();
    }

    /**
     * @param {string} token
     */
    public async revoke(token: string): Promise<void> {
        const session = await this.sessionModel.findOne({
            $or: [{ accessToken: token }, { refreshToken: token }],
        }).exec();

        if (!session) {
            throw new UnauthorizedException();
        }

        await this.revokeSession(session);
    }


    /**
     * @param {string} refreshToken
     */
    public async refreshToken(refreshToken: string): Promise<SessionDto> {
        const redisClient = await this.getRedisClient();
        const accessToken = await redisClient.get('REFRESH_TOKEN::' + refreshToken);

        if (!accessToken) {
            throw new UnauthorizedException();
        }

        const session = await this.sessionModel.findOne({
            $or: [{ accessToken: accessToken }],
        }).exec();

        const user = await this.getUserBySession(session);
        const newJwtToken = this.generateJWTToken(user);

        await this.revokeSession(session);

        const newSessionDto = SessionDto.generate();
        session.set(newSessionDto.forModel()).save();

        await this.storeSession(newSessionDto, newJwtToken);

        return newSessionDto;
    }


    public async getSessionJWT(accessToken: string): Promise<string> {
        const redisClient = await this.getRedisClient();

        const jwtString = await redisClient.get('ACCESS_TOKEN::' + accessToken);
        if (!jwtString) {
            throw new UnauthorizedException();
        }

        return jwtString;
    }


    protected async storeSession(sessionDto: SessionDto, jwtToken: string): Promise<void> {
        const redisClient = await this.getRedisClient();

        await Promise.all([
            redisClient.set(
                'ACCESS_TOKEN::' + sessionDto.accessToken,
                jwtToken,
                'EX',
                sessionDto.accessTokenLifeTime,
            ),
            redisClient.set(
                'REFRESH_TOKEN::' + sessionDto.refreshToken,
                sessionDto.accessToken,
                'EX',
                sessionDto.refreshTokenLifeTime,
            ),
        ]);
    }


    protected async revokeSession(session: SessionModel): Promise<void> {
        const redisClient = await this.getRedisClient();

        const sessionDto = new SessionDto({
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            expireIn: session.expireIn,
            refreshTokenExpireIn: session.refreshTokenExpireIn,
        });

        await Promise.all([
            redisClient.del('ACCESS_TOKEN::' + sessionDto.accessToken),
            redisClient.del('REFRESH_TOKEN::' + sessionDto.refreshToken),
        ]);
    }
}
