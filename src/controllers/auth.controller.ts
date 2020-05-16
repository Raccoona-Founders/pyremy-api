import { Request, Response } from 'express';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Inject,
    Patch,
    Post, Req,
    Res, UnauthorizedException,
} from '@nestjs/common';
import { IdentityService, SessionService } from '../identity/services';
import { AuthService } from '../services';
import { LoginUserDto, RegisterUserDto } from '../dto';

@Controller('auth')
export class AuthController {
    public constructor(
        private readonly authService: AuthService,
        @Inject(IdentityService) private readonly identityService: IdentityService,
        @Inject(SessionService) private readonly sessionService: SessionService,
    ) {
    }


    @Post('registration')
    public async registration(@Body() data: Partial<RegisterUserDto>): Promise<object> {

        const registerUserDto = new RegisterUserDto(data);

        if (await this.identityService.isUserExists(registerUserDto.email)) {
            throw new HttpException('User with current email already exists', 400);
        }

        return (await this.identityService.registerUser(registerUserDto)).toResponse();
    }


    @Post('login')
    public async login(@Req() request: Request, @Body() loginData: Partial<LoginUserDto>): Promise<object> {
        const loginUser = new LoginUserDto(loginData);

        const session = await this.authService.login(loginUser, {
            ip: request.ip,
            userAgent: request.get('user-agent'),
        });

        return session.forModel();
    }


    @Get('me')
    public async userInfo(@Req() request: Request, @Res() res: Response): Promise<void> {
        const [, token] = (request.get('Authorization') || '').split(' ');
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const userInfo = await this.authService.userInfo(token);

            res.status(HttpStatus.OK).send(userInfo);
        } catch (error) {
            throw new UnauthorizedException();
        }
    }


    @Delete('logout')
    @HttpCode(204)
    public async logout(@Req() request: Request): Promise<void> {
        const [, token] = (request.get('Authorization') || '').split(' ');
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            await this.authService.logout(token);
        } catch (error) {

        }
    }


    @Patch('refresh-token')
    public async refreshToken(@Req() req: Request): Promise<object> {
        const [, token] = (req.get('Authorization') || '').split(' ');
        if (!token) {
            throw new UnauthorizedException();
        }

        const newSession = await this.sessionService.refreshToken(token);

        return newSession.forModel();
    }
}
