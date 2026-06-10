import { Router } from 'express';
import { SatelliteController } from '../modules/satellites/controllers/SatelliteController';
import { satelliteRepository } from '../modules/satellites/repositories/SatelliteRepository';
import { FetchCelesTrakClient } from '../modules/satellites/services/CelesTrakClient';
import { authMiddleware } from '../middlewares/AuthMiddleware';

export const buildSatellitesRoutes = (): Router => {
  const router = Router();
  const satelliteController = SatelliteController.build(satelliteRepository, new FetchCelesTrakClient());

  router.get('/', satelliteController.list);
  router.post('/upsert', authMiddleware, satelliteController.upsert);

  return router;
};

export default buildSatellitesRoutes;