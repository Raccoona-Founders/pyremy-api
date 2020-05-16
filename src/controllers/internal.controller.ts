import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Controller, Get, Inject, Req, Res, UnauthorizedException } from '@nestjs/common';
import { SessionService } from '../identity/services';

@Controller('internal')
export class InternalController {
    public constructor(
        @Inject(SessionService) private readonly sessionService: SessionService,
    ) {
    }

    @Get('authorize')
    public async authorize(@Req() req: Request, @Res() response: Response): Promise<void> {
        const [, token] = (req.get('Authorization') || '').split(' ');
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const jwtToken = await this.sessionService.getSessionJWT(token);

            response.header('Authorization', `Bearer ${jwtToken}`)
                .status(204)
                .send();
        } catch (error) {
            response
                .status(401)
                .send();
        }
    }


    @Get('check')
    public async check(@Req() req: Request): Promise<object> {
        const [, token] = (req.get('Authorization') || '').split(' ');
        if (!token) {
            throw new UnauthorizedException();
        }

        let jwtToken: any,
            parsedJwtToken: any;

        try {
            jwtToken = await this.sessionService.getSessionJWT(token);
            parsedJwtToken = jwt.decode(jwtToken);
        } catch (error) {
        }

        return {
            token,
            jwtToken,
            parsedJwtToken,
        };
    }
}
