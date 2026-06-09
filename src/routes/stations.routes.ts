import { Router } from 'express';
import { StationController } from '../modules/stations/controllers/StationController';
import { stationRepository } from '../modules/stations/repositories/StationRepository';
import { authMiddleware } from '../middlewares/AuthMiddleware';


export const buildStationRoutes = (): Router => {
  const router = Router();
  const stationController = StationController.build(stationRepository);

  router.get('/', stationController.list);
  router.post('/', authMiddleware, stationController.create);
  router.patch('/:uuid', authMiddleware, stationController.update);
  router.delete('/:uuid', authMiddleware, stationController.delete);
  router.post('/:uuid/regenerate-key', authMiddleware, stationController.regenerateKey);

  return router;
}
