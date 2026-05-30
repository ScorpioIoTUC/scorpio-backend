import { Router } from 'express';
import { UserController } from '../modules/users/controllers/UserController';
import { UserRepository } from '../modules/users/repositories/UserRepository';

export const buildUserRoutes = (userRepository: UserRepository): Router => {
  const router = Router();
  const userController = UserController.build(userRepository);

  router.post('/', userController.create);
  router.get('/', userController.list);
  router.get('/:id', userController.get);
  router.patch('/:id', userController.update);
  router.delete('/:id', userController.delete);

  return router;
};