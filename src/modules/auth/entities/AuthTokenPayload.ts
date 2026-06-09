export interface AuthTokenPayload {
    sub: number;
    email: string;
    type: 'NORMAL' | 'ADMIN';
}