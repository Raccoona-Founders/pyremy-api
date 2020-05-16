import { PasswordHelper } from './password.helper';

describe('PasswordHelper', () => {
    const testPassword = 'Ab1234567890';

    it('check hashPassword', async () => {
        const passwordHash = await PasswordHelper.hashPassword(testPassword);

        console.log(passwordHash);

        expect(typeof passwordHash === 'string').toBeTruthy();
    });

    it('check matchPassword', async () => {
        const passwordHash = await PasswordHelper.hashPassword(testPassword);

        console.log(passwordHash);

        expect(PasswordHelper.matchPassword(testPassword, passwordHash)).toBeTruthy();
    });
});
