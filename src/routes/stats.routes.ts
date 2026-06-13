import { Router } from 'express';
import { statsRepository } from '../modules/stats/repositories/StatsRepository';
import { StatsController } from '../modules/stats/controllers/StatsController';

export const buildStatsRoutes = (): Router => {
  const router = Router();
  const statsController = StatsController.build(statsRepository);

  router.get('/count-station-monthly-packets', statsController.countStationMonthlyPacketsHandler);
  router.get('/count-active-stations', statsController.countActiveStationsHandler);
  router.get('/count-total-stations', statsController.countTotalPacketsHandler);

  return router;
};
