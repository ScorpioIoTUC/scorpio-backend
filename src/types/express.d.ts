import { AuthenticatedUser } from '../modules/auth/dto/AuthenticatedUser';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}