import { Router } from 'express';
import { UserController } from '../modules/users/controllers/UserController';
import { userRepository } from '../modules/users/repositories/UserRepository';

export const buildUserRoutes = (): Router => {
  const router = Router();
  const userController = UserController.build(userRepository);

  router.post('/', userController.create);
  router.get('/', userController.list);
  router.get('/:id', userController.get);
  router.patch('/:id', userController.update);
  router.delete('/:id', userController.delete);

  return router;
};