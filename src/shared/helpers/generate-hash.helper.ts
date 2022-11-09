const bcrypt = require('bcrypt');

export function generateHash(password: string): string {
    return bcrypt.hash(password, 10);
}

export function checkHash(passwordPlain: string, hash: string): boolean {
    return bcrypt.compareSync(passwordPlain, hash);
}