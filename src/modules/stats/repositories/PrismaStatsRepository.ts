import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';
import { CountActiveStationsDTO } from '../dto/CountActiveStationsDTO';
import { CountActiveStationsResponseDTO } from '../dto/CountActiveStationsResponseDTO';
import { CountStationMonthlyPacketsDTO } from '../dto/CountStationMonthlyPacketsDTO';
import { CountStationMonthlyPacketsResponseDTO } from '../dto/CountStationMonthlyPacketsResponseDTO';
import { CountTotalPacketsResponseDTO } from '../dto/CountTotalPacketsResponseDTO';
import { StatsRepository } from './StatsRepository';

export class PrismaStatsRepository implements StatsRepository {
  async countStationMonthlyPackets(query: CountStationMonthlyPacketsDTO): Promise<CountStationMonthlyPacketsResponseDTO> {
    const days = query.days ?? 30;
    const since = new Date();
    since.setDate(since.getDate() - (days - 1));
    since.setHours(0, 0, 0, 0);

    const grouped = await prisma.$queryRaw<Array<{
      date: string;
      satellite_norad_id: number;
      satellite_display_name: string;
      count: bigint;
    }>>(Prisma.sql`
      SELECT
        to_char(date_trunc('day', p.created_at), 'YYYY-MM-DD') AS date,
        s.norad_id AS satellite_norad_id,
        s.display_name AS satellite_display_name,
        COUNT(*)::bigint AS count
      FROM "Packet" p
      INNER JOIN "Satellite" s ON s.id = p.satellite_id
      INNER JOIN "Station" st ON st.id = p.station_id
      WHERE st.uuid = ${query.stationUuid}
        AND p.created_at >= ${since}
      GROUP BY 1, 2, 3
      ORDER BY 1 ASC, 2 ASC
    `);

    return {
      stationUuid: query.stationUuid,
      days,
      data: grouped.map((row: {
        date: string;
        satellite_norad_id: number;
        satellite_display_name: string;
        count: bigint;
      }) => ({
        date: row.date,
        satelliteNoradId: row.satellite_norad_id,
        satelliteDisplayName: row.satellite_display_name,
        count: Number(row.count),
      })),
    };
  }

  async countActiveStations(query: CountActiveStationsDTO): Promise<CountActiveStationsResponseDTO> {
    const where: Prisma.StationWhereInput = {};

    if (query.status !== undefined) {
      where.status = query.status;
    }

    const total = await prisma.station.count({ where });

    return {
      status: query.status ?? null,
      total,
    };
  }

  async countTotalPackets(): Promise<CountTotalPacketsResponseDTO> {
    const totalPacketsReceived = await prisma.packet.count();

    return { totalPacketsReceived };
  }
}
