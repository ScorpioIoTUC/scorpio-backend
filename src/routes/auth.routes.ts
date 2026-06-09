import { Router } from 'express';
import { UserRepository } from '../modules/users/repositories/UserRepository';

export const buildAuthRoutes = (): Router => {
    const router = Router();
    

    return router;
}



export default buildAuthRoutes;