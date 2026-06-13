import { CountActiveStationsDTO } from '../dto/CountActiveStationsDTO';
import { CountActiveStationsResponseDTO } from '../dto/CountActiveStationsResponseDTO';
import { CountStationMonthlyPacketsDTO } from '../dto/CountStationMonthlyPacketsDTO';
import { CountStationMonthlyPacketsResponseDTO } from '../dto/CountStationMonthlyPacketsResponseDTO';
import { CountTotalPacketsResponseDTO } from '../dto/CountTotalPacketsResponseDTO';
import { PrismaStatsRepository } from './PrismaStatsRepository';

export interface StatsRepository {
  countStationMonthlyPackets(query: CountStationMonthlyPacketsDTO): Promise<CountStationMonthlyPacketsResponseDTO>;
  countActiveStations(query: CountActiveStationsDTO): Promise<CountActiveStationsResponseDTO>;
  countTotalPackets(): Promise<CountTotalPacketsResponseDTO>;
}

export const statsRepository: StatsRepository = new PrismaStatsRepository();
