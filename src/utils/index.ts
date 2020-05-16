export * from './password.helper';

import RandomString from 'randomstring';

export function generateToken(length: number = 40): string {
    return RandomString.generate({
        length: length,
        charset: 'alphanumeric',
    });
}
