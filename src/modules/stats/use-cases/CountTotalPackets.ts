import { CountTotalPacketsResponseDTO } from '../dto/CountTotalPacketsResponseDTO';
import { StatsRepository } from '../repositories/StatsRepository';

export class CountTotalPackets {
  constructor(private readonly statsRepository: StatsRepository) {}

  async execute(): Promise<CountTotalPacketsResponseDTO> {
    return this.statsRepository.countTotalPackets();
  }
}
