import { Request, Response } from 'express';
import { ListSatellitesDTO } from '../dto/ListSatellitesDTO';
import { SatelliteRepository } from '../repositories/SatelliteRepository';
import { CelesTrakClient } from '../services/CelesTrakClient';
import { ListSatellites } from '../use-cases/ListSatellites';
import { UpsertSatellites } from '../use-cases/UpsertSatellites';

export class SatelliteController {
  private readonly listSatellites: ListSatellites;
  private readonly upsertSatellites: UpsertSatellites;

  constructor(
    satelliteRepository: SatelliteRepository,
    celestrakClient: CelesTrakClient,
  ) {
    this.listSatellites = new ListSatellites(satelliteRepository);
    this.upsertSatellites = new UpsertSatellites(satelliteRepository, celestrakClient);
  }

  public static build(
    satelliteRepository: SatelliteRepository,
    celestrakClient: CelesTrakClient,
  ): SatelliteController {
    return new SatelliteController(satelliteRepository, celestrakClient);
  }

  list = async (req: Request, res: Response): Promise<Response> => {
    const pageRaw = req.query.page;
    const limitRaw = req.query.limit;
    const noradIdRaw = req.query.noradId;
    const displayNameRaw = req.query.displayName;

    const page = pageRaw === undefined ? 1 : Number(pageRaw);
    const limit = limitRaw === undefined ? 20 : Number(limitRaw);
    const noradId = noradIdRaw === undefined ? undefined : Number(noradIdRaw);
    const displayName = typeof displayNameRaw === 'string' ? displayNameRaw : undefined;

    if (typeof pageRaw !== 'undefined' && (typeof pageRaw !== 'string' || Number.isNaN(page))) {
      return res.status(400).json({ message: 'Invalid page' });
    }

    if (typeof limitRaw !== 'undefined' && (typeof limitRaw !== 'string' || Number.isNaN(limit))) {
      return res.status(400).json({ message: 'Invalid limit' });
    }

    if (typeof noradIdRaw !== 'undefined' && (typeof noradIdRaw !== 'string' || Number.isNaN(noradId))) {
      return res.status(400).json({ message: 'Invalid noraId' });
    }

    if (page < 1) {
      return res.status(400).json({ message: 'Page must be greater than or equal to 1' });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({ message: 'Limit must be between 1 and 100' });
    }

    const query: ListSatellitesDTO = { page, limit, noradId, displayName };
    const satellites = await this.listSatellites.listSatellites(query);

    return res.status(200).json(satellites);
  };

  upsert = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.upsertSatellites.upsertSatellites();

      return res.status(200).json(result);
    } catch (error) {
      console.error('[Satellites][UPSERT] Failed to synchronize satellites', error);

      const message = error instanceof Error ? error.message : 'Unexpected error. check the logs for more details';
      const statusCode = message.includes('CelesTrak') || message.includes('download') ? 502 : 400;

      return res.status(statusCode).json({ message });
    }
  };
}
