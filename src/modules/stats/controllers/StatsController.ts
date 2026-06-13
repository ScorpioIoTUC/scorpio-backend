import { Request, Response } from 'express';
import { CountActiveStations } from '../use-cases/CountActiveStations';
import { CountStationMonthlyPackets } from '../use-cases/CountStationMonthlyPackets';
import { CountTotalPackets } from '../use-cases/CountTotalPackets';
import { StatsRepository } from '../repositories/StatsRepository';

const parseBoolean = (value: unknown): boolean | undefined | null => {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
};

export class StatsController {
  private readonly countStationMonthlyPackets: CountStationMonthlyPackets;
  private readonly countActiveStations: CountActiveStations;
  private readonly countTotalPackets: CountTotalPackets;

  constructor(statsRepository: StatsRepository) {
    this.countStationMonthlyPackets = new CountStationMonthlyPackets(statsRepository);
    this.countActiveStations = new CountActiveStations(statsRepository);
    this.countTotalPackets = new CountTotalPackets(statsRepository);
  }

  public static build(statsRepository: StatsRepository): StatsController {
    return new StatsController(statsRepository);
  }

  countStationMonthlyPacketsHandler = async (req: Request, res: Response): Promise<Response> => {
    const stationUuidRaw = req.query.stationUuid;
    const daysRaw = req.query.days;

    if (typeof stationUuidRaw !== 'string' || !stationUuidRaw) {
      return res.status(400).json({ message: 'Invalid stationUuid' });
    }

    const days = daysRaw === undefined ? 30 : Number(daysRaw);
    if (typeof daysRaw !== 'undefined' && (typeof daysRaw !== 'string' || Number.isNaN(days) || days < 1 || days > 365)) {
      return res.status(400).json({ message: 'Invalid days' });
    }

    const result = await this.countStationMonthlyPackets.execute({ stationUuid: stationUuidRaw, days });
    return res.status(200).json(result);
  };

  countActiveStationsHandler = async (req: Request, res: Response): Promise<Response> => {
    const statusRaw = req.query.status;
    const status = parseBoolean(statusRaw);

    if (status === null) {
      return res.status(400).json({ message: 'Invalid status. Use true or false' });
    }

    const result = await this.countActiveStations.execute({ status });
    return res.status(200).json(result);
  };

  countTotalPacketsHandler = async (_req: Request, res: Response): Promise<Response> => {
    const result = await this.countTotalPackets.execute();
    return res.status(200).json(result);
  };
}
