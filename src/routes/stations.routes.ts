import { Router } from 'express';
import { StationController } from '../modules/stations/controllers/StationController';
import { stationRepository } from '../modules/stations/repositories/StationRepository';
import { userRepository } from '../modules/users/repositories/UserRepository';

export const buildStationRoutes = (): Router => {
  const router = Router();
  const stationController = StationController.build(stationRepository, userRepository);

  router.post('/', stationController.create);
  router.get('/', stationController.list);
  router.patch('/:uuid', stationController.update);
  router.delete('/:uuid', stationController.delete);
  router.post('/:uuid/regenerate-key', stationController.regenerateKey);

  return router;
}
