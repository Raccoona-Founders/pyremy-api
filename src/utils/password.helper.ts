import bcrypt from 'bcrypt';

// @TODO Move to Configuration
const saltRounds = 5;

export class PasswordHelper {
    public static async matchPassword(password: string, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash);
    }

    public static async hashPassword(password: string): Promise<string> {
        return bcrypt.hashSync(password, saltRounds);
    }
}