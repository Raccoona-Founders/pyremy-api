import { LoginUserDto } from './login-user.dto';

describe('DTOs', () => {
    describe('LoginUserDTO', () => {
        const loginUser = new LoginUserDto({
            login: 'info@raccoona.io',
            password: 'Ab123456789',
        });

        it('Should exists login', () => {
            expect(loginUser.login).toBe('info@raccoona.io');
        });

        it('Should exists password', () => {
            expect(loginUser.password).toBe('Ab123456789');
        });
    });
});
