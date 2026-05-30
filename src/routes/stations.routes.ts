import { Router } from 'express';
import { StationController } from '../modules/stations/controllers/StationController';
import { StationRepository } from '../modules/stations/repositories/StationRepository';
import { UserRepository } from '../modules/users/repositories/UserRepository';

export const buildStationRoutes = (stationRepository: StationRepository, userRepository: UserRepository): Router => {
  const router = Router();
  const stationController = StationController.build(stationRepository, userRepository);
  
  router.post('/', stationController.create);
  router.get('/', stationController.list);
  router.patch('/:uuid', stationController.update);
  router.delete('/:uuid', stationController.delete);
  router.post('/:uuid/regenerate-key', stationController.regenerateKey);
  
  return router;
}
