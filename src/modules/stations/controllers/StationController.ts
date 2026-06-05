import { Request, Response } from 'express';
import { CreateStationDTO } from '../dto/CreateStationDTO';
import { ListStationsDTO } from '../dto/ListStationsDTO';
import { UpdateStationDTO } from '../dto/UpdateStationDTO';
import { StationRepository } from '../repositories/StationRepository';
import { UserRepository } from '../../users/repositories/UserRepository';
import { CreateStation } from '../use-cases/CreateStation';
import { DeleteStation } from '../use-cases/DeleteStation';
import { ListStations } from '../use-cases/ListStations';
import { RegenerateStationKey } from '../use-cases/RegenerateStationKey';
import { UpdateStation } from '../use-cases/UpdateStation';

export class StationController {
  private readonly createStation: CreateStation;
  private readonly listStations: ListStations;
  private readonly updateStation: UpdateStation;
  private readonly deleteStation: DeleteStation;
  private readonly regenerateStationKey: RegenerateStationKey;

  constructor(
    private readonly stationRepository: StationRepository,
    private readonly userRepository: UserRepository,
  ) {
    this.createStation = new CreateStation(this.stationRepository, this.userRepository);
    this.listStations = new ListStations(this.stationRepository);
    this.updateStation = new UpdateStation(this.stationRepository);
    this.deleteStation = new DeleteStation(this.stationRepository);
    this.regenerateStationKey = new RegenerateStationKey(this.stationRepository);
  }

  public static build(stationRepository: StationRepository, userRepository: UserRepository): StationController {
    return new StationController(stationRepository, userRepository);
  }

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({
          message: 'Invalid request body.',
        });
      }
      const payload = req.body as CreateStationDTO;
      const stationCredentials = await this.createStation.execute(payload);
      if (!stationCredentials) {
        return res.status(404).json({ message: 'Owner user not found' });
      }
      return res.status(201).json(stationCredentials);
    } catch (error) {
      console.error('[Stations][CREATE] Failed to create station', error);
      const message =
        error instanceof Error
          ? `Unexpected error: ${error.message}`
          : 'Unexpected error. check the logs for more details';
      return res.status(400).json({ message });
    }
  };

  list = async (req: Request, res: Response): Promise<Response> => {
    const ownerIdRaw = req.query.ownerId;
    const pageRaw = req.query.page;
    const limitRaw = req.query.limit;

    const ownerId = ownerIdRaw === undefined ? undefined : Number(ownerIdRaw);
    const page = pageRaw === undefined ? 1 : Number(pageRaw);
    const limit = limitRaw === undefined ? 100 : Number(limitRaw);

    if (ownerIdRaw !== undefined && (typeof ownerIdRaw !== 'string' || Number.isNaN(ownerId))) {
      return res.status(400).json({ message: 'Invalid owner id' });
    }

    if (typeof pageRaw !== 'undefined' && (typeof pageRaw !== 'string' || Number.isNaN(page))) {
      return res.status(400).json({ message: 'Invalid page' });
    }

    if (typeof limitRaw !== 'undefined' && (typeof limitRaw !== 'string' || Number.isNaN(limit))) {
      return res.status(400).json({ message: 'Invalid limit' });
    }

    if (page < 1) {
      return res.status(400).json({ message: 'Page must be greater than or equal to 1' });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({ message: 'Limit must be between 1 and 100' });
    }

    const query: ListStationsDTO = {
      ownerId,
      page,
      limit,
    };

    const stations = await this.listStations.execute(query);

    return res.status(200).json(stations);
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const uuid = String(req.params.uuid);

    if (!uuid) {
      return res.status(400).json({ message: 'Invalid station uuid' });
    }

    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ message: 'Invalid request body.' });
    }

    const payload = req.body as UpdateStationDTO;

    const updatedStation = await this.updateStation.execute(uuid, payload);

    if (!updatedStation) {
      return res.status(404).json({ message: 'Station not found' });
    }

    return res.status(200).json(updatedStation);
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const uuid = String(req.params.uuid);

    if (!uuid) {
      return res.status(400).json({ message: 'Invalid station uuid' });
    }

    const deleted = await this.deleteStation.execute(uuid);

    if (!deleted) {
      return res.status(404).json({ message: 'Station not found' });
    }

    return res.status(204).send();
  };

  regenerateKey = async (req: Request, res: Response): Promise<Response> => {
    const uuid = String(req.params.uuid);

    if (!uuid) {
      return res.status(400).json({ message: 'Invalid station uuid' });
    }

    const stationCredentials = await this.regenerateStationKey.execute(uuid);

    if (!stationCredentials) {
      return res.status(404).json({ message: 'Station not found' });
    }

    return res.status(200).json(stationCredentials);
  };
}