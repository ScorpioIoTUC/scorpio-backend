import { Request, Response } from 'express';
import { CreatePacketDTO } from '../dto/CreatePacketDTO';
import { ListPacketsDTO } from '../dto/ListPacketsDTO';
import { PacketRepository } from '../repositories/PacketRepository';
import { SatelliteRepository } from '../../satellites/repositories/SatelliteRepository';
import { StationRepository } from '../../stations/repositories/StationRepository';
import { CreatePacket } from '../use-cases/CreatePacket';
import { ListPackets } from '../use-cases/ListPackets';

const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

const toRawPayload = (value: unknown): string | number[] | null => {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value) && value.every((item) => typeof item === 'number' && Number.isFinite(item))) {
    return value;
  }

  return null;
};

const parsePacketBody = (body: unknown): CreatePacketDTO | null => {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const packet = body as Record<string, unknown>;

  if (!isFiniteNumber(packet.noradId)) return null;
  if (!isFiniteNumber(packet.latitude)) return null;
  if (!isFiniteNumber(packet.longitude)) return null;
  if (!isFiniteNumber(packet.altitude)) return null;
  if (!isFiniteNumber(packet.rssi)) return null;
  if (!isFiniteNumber(packet.snr)) return null;
  if (!isFiniteNumber(packet.slantDistance)) return null;
  if (!isFiniteNumber(packet.elevationAngle)) return null;
  if (!isFiniteNumber(packet.frequencyError)) return null;
  if (typeof packet.crc !== 'boolean') return null;

  const rawPayload = toRawPayload(packet.rawPayload);

  if (rawPayload === null) {
    return null;
  }

  return {
    noradId: packet.noradId,
    latitude: packet.latitude,
    longitude: packet.longitude,
    altitude: packet.altitude,
    rssi: packet.rssi,
    snr: packet.snr,
    slantDistance: packet.slantDistance,
    elevationAngle: packet.elevationAngle,
    frequencyError: packet.frequencyError,
    crc: packet.crc,
    rawPayload,
  };
};

export class PacketController {
  private readonly createPacket: CreatePacket;
  private readonly listPackets: ListPackets;

  constructor(
    packetRepository: PacketRepository,
    stationRepository: StationRepository,
    satelliteRepository: SatelliteRepository,
  ) {
    this.createPacket = new CreatePacket(packetRepository, stationRepository, satelliteRepository);
    this.listPackets = new ListPackets(packetRepository);
  }

  public static build(
    packetRepository: PacketRepository,
    stationRepository: StationRepository,
    satelliteRepository: SatelliteRepository,
  ): PacketController {
    return new PacketController(packetRepository, stationRepository, satelliteRepository);
  }

  create = async (req: Request, res: Response): Promise<Response> => {
    const packet = parsePacketBody(req.body);

    if (!packet) {
      return res.status(400).json({ message: 'Invalid request body.' });
    }

    const result = await this.createPacket.execute(req.header('authorization'), packet);

    if (!result) {
      return res.status(401).json({ message: 'Invalid station credentials' });
    }

    return res.status(201).json(result);
  };

  list = async (req: Request, res: Response): Promise<Response> => {
    const stationUuidRaw = req.query.stationUuid;
    const satelliteNoradIdRaw = req.query.satelliteNoradId;
    const satelliteDisplayNameRaw = req.query.satelliteDisplayName;
    const satelliteLatitudeRaw = req.query.satelliteLatitude;
    const satelliteLongitudeRaw = req.query.satelliteLongitude;
    const startDateRaw = req.query.startDate;
    const endDateRaw = req.query.endDate;
    const pageRaw = req.query.page;
    const limitRaw = req.query.limit;

    const parseNumber = (value: unknown): number | undefined => {
      if (value === undefined) {
        return undefined;
      }

      if (typeof value !== 'string') {
        return Number.NaN;
      }

      const parsed = Number(value);

      return Number.isNaN(parsed) ? Number.NaN : parsed;
    };

    const parseDate = (value: unknown): Date => {
      if (typeof value !== 'string') {
        return new Date(Number.NaN);
      }

      return new Date(value);
    };

    const satelliteNoradId = parseNumber(satelliteNoradIdRaw);
    const satelliteLatitude = parseNumber(satelliteLatitudeRaw);
    const satelliteLongitude = parseNumber(satelliteLongitudeRaw);
    const startDate = parseDate(startDateRaw);
    const endDate = parseDate(endDateRaw);
    const page = pageRaw === undefined ? 1 : Number(pageRaw);
    const limit = limitRaw === undefined ? 100 : Number(limitRaw);

    if (typeof stationUuidRaw !== 'undefined' && typeof stationUuidRaw !== 'string') {
      return res.status(400).json({ message: 'Invalid stationUuid' });
    }

    if (typeof satelliteNoradIdRaw !== 'undefined' && Number.isNaN(satelliteNoradId)) {
      return res.status(400).json({ message: 'Invalid satelliteNoradId' });
    }

    if (typeof satelliteDisplayNameRaw !== 'undefined' && typeof satelliteDisplayNameRaw !== 'string') {
      return res.status(400).json({ message: 'Invalid satelliteDisplayName' });
    }

    if (typeof satelliteLatitudeRaw !== 'undefined' && Number.isNaN(satelliteLatitude)) {
      return res.status(400).json({ message: 'Invalid satelliteLatitude' });
    }

    if (typeof satelliteLongitudeRaw !== 'undefined' && Number.isNaN(satelliteLongitude)) {
      return res.status(400).json({ message: 'Invalid satelliteLongitude' });
    }

    if (typeof startDateRaw !== 'undefined' && Number.isNaN(startDate.getTime())) {
      return res.status(400).json({ message: 'Invalid startDate' });
    }

    if (typeof endDateRaw !== 'undefined' && Number.isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Invalid endDate' });
    }

    if (startDate !== undefined && endDate !== undefined && startDate > endDate) {
      return res.status(400).json({ message: 'startDate must be before or equal to endDate' });
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

    const query: ListPacketsDTO = {
      page,
      limit,
      stationUuid: typeof stationUuidRaw === 'string' ? stationUuidRaw : undefined,
      satelliteNoradId,
      satelliteDisplayName: typeof satelliteDisplayNameRaw === 'string' ? satelliteDisplayNameRaw : undefined,
      satelliteLatitude,
      satelliteLongitude,
      startDate: typeof startDateRaw === 'string' ? startDate : undefined,
      endDate: typeof endDateRaw === 'string' ? endDate : undefined,
    };

    const packets = await this.listPackets.execute(query);

    return res.status(200).json(packets);
  }
}