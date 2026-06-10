import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthenticatedUser } from '../entities/AuthenticateUser';

export class JwtService {
    private getSecret(): string {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not configured');
        }
        return secret;
    }

    sign(user: AuthenticatedUser): string {
        return jwt.sign(
            {
                sub: user.id,
                email: user.email,
                type: user.type,
            },
            this.getSecret(),
            { expiresIn: '24h' }
        );
    }

    verify(token: string): JwtPayload {
        return jwt.verify(token, this.getSecret()) as JwtPayload;
    }
}