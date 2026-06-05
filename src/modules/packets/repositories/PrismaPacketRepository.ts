import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';
import { CreatePacketDTO } from '../dto/CreatePacketDTO';
import { ListPacketsDTO } from '../dto/ListPacketsDTO';
import { ListPacketsResponseDTO } from '../dto/ListPacketsResponseDTO';
import { PacketRepository } from './PacketRepository';

const toPacketPayload = (rawPayload: CreatePacketDTO['rawPayload']): Uint8Array<ArrayBuffer> => {
  if (typeof rawPayload === 'string') {
    return Buffer.from(rawPayload, 'base64');
  }

  return Uint8Array.from(rawPayload) as Uint8Array<ArrayBuffer>;
};

const toPacketListItem = (packet: {
  id: number;
  station_id: number;
  satellite_id: number;
  satellite_latitude: number;
  satellite_longitude: number;
  satellite_altitude: number;
  slant_distance: number;
  angle_elevation: number;
  rssi: number;
  snr: number;
  frec_error: number;
  crc: boolean;
  raw_payload: Uint8Array<ArrayBuffer>;
  created_at: Date;
  station: { uuid: string };
  satellite: { norad_id: number; display_name: string };
}) => ({
  id: packet.id,
  stationId: packet.station_id,
  stationUuid: packet.station.uuid,
  satelliteId: packet.satellite_id,
  satelliteNoradId: packet.satellite.norad_id,
  satelliteDisplayName: packet.satellite.display_name,
  satelliteLatitude: packet.satellite_latitude,
  satelliteLongitude: packet.satellite_longitude,
  satelliteAltitude: packet.satellite_altitude,
  slantDistance: packet.slant_distance,
  angleElevation: packet.angle_elevation,
  rssi: packet.rssi,
  snr: packet.snr,
  frequencyError: packet.frec_error,
  crc: packet.crc,
  rawPayload: Array.from(packet.raw_payload),
  createdAt: packet.created_at,
});

const buildWhere = (query: ListPacketsDTO): Prisma.PacketWhereInput | undefined => {
  const conditions: Prisma.PacketWhereInput[] = [];
  if (query.stationUuid !== undefined) {
    conditions.push({ station: { uuid: query.stationUuid } });
  }
  if (query.satelliteNoradId !== undefined) {
    conditions.push({ satellite: { norad_id: query.satelliteNoradId } });
  }
  if (query.satelliteDisplayName !== undefined) {
    conditions.push({
      satellite: {
        display_name: {
          contains: query.satelliteDisplayName,
          mode: 'insensitive',
        },
      },
    });
  }

  if (query.satelliteLatitude !== undefined) {
    conditions.push({ satellite_latitude: query.satelliteLatitude });
  }

  if (query.satelliteLongitude !== undefined) {
    conditions.push({ satellite_longitude: query.satelliteLongitude });
  }

  if (query.startDate !== undefined || query.endDate !== undefined) {
    conditions.push({
      created_at: {
        ...(query.startDate !== undefined ? { gte: query.startDate } : {}),
        ...(query.endDate !== undefined ? { lte: query.endDate } : {}),
      },
    });
  }

  return conditions.length > 0 ? { AND: conditions } : undefined;
};

export class PrismaPacketRepository implements PacketRepository {
  async create(data: CreatePacketDTO, stationId: number, satelliteId: number): Promise<void> {
    await prisma.packet.create({
      data: {
        station_id: stationId,
        satellite_id: satelliteId,
        satellite_latitude: data.latitude,
        satellite_longitude: data.longitude,
        satellite_altitude: data.altitude,
        slant_distance: data.slantDistance,
        angle_elevation: data.elevationAngle,
        rssi: data.rssi,
        snr: data.snr,
        frec_error: data.frequencyError,
        crc: data.crc,
        raw_payload: toPacketPayload(data.rawPayload),
      },
    });
  }

  async findAll(query: ListPacketsDTO): Promise<ListPacketsResponseDTO> {
    const limit = query.limit ?? 100;
    const page = query.page ?? 1;
    const skip = (page - 1) * limit;
    const where = buildWhere(query);

    const [total, packets] = await prisma.$transaction([
      prisma.packet.count({ where }),
      prisma.packet.findMany({
        where,
        orderBy: [
          { created_at: 'desc' },
          { id: 'desc' },
        ],
        skip,
        take: limit,
        include: {
          station: {
            select: {
              uuid: true,
            },
          },
          satellite: {
            select: {
              norad_id: true,
              display_name: true,
            },
          },
        },
      }),
    ]);

    return {
      data: packets.map(toPacketListItem),
      pagination: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }
}