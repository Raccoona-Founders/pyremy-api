import { HttpException, Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import { PasswordHelper } from '../utils';
import { LoginUserDto, SessionDto } from '../dto';
import { SessionService, IdentityService } from '../identity/services';

@Injectable()
export class AuthService {
    public constructor(
        @Inject(IdentityService) private readonly identityService: IdentityService,
        @Inject(SessionService) private readonly sessionService: SessionService,
    ) {
    }

    /**
     * @param {LoginUserDto} loginBody
     * @param {object} additionData
     *
     * @return {SessionDto}
     */
    public async login(loginBody: LoginUserDto, additionData: object): Promise<SessionDto> {
        const user = await this.identityService.getUserByEmail(loginBody.login);

        if (!user) {
            throw new HttpException('Invalid credentials', 400);
        }

        const matchPassword = await PasswordHelper.matchPassword(loginBody.password, user.password);

        if (!matchPassword) {
            throw new HttpException('Invalid credentials', 400);
        }

        return await this.sessionService.creteSession(user, additionData);
    }

    /**
     * @param {string} accessToken
     */
    public async logout(accessToken: string): Promise<void> {
        return await this.sessionService.revoke(accessToken);
    }

    /**
     * @param {string} accessToken
     */
    public async userInfo(accessToken: string): Promise<object> {
        const jwtToken = await this.sessionService.getSessionJWT(accessToken);

        const data = jwt.decode(jwtToken) as Record<string, any>;
        const userUuid = _.get(data, 'sub');

        if (!userUuid) {
            throw new Error('Invalid users JWT token');
        }

        const user = await this.identityService.getUserByUUID(userUuid);

        return user.toResponse();
    }
}
