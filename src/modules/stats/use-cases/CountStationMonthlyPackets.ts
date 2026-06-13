import { CountStationMonthlyPacketsDTO } from '../dto/CountStationMonthlyPacketsDTO';
import { CountStationMonthlyPacketsResponseDTO } from '../dto/CountStationMonthlyPacketsResponseDTO';
import { StatsRepository } from '../repositories/StatsRepository';

export class CountStationMonthlyPackets {
  constructor(private readonly statsRepository: StatsRepository) {}

  async execute(query: CountStationMonthlyPacketsDTO): Promise<CountStationMonthlyPacketsResponseDTO> {
    return this.statsRepository.countStationMonthlyPackets(query);
  }
}
