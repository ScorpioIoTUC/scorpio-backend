import { CountActiveStationsDTO } from '../dto/CountActiveStationsDTO';
import { CountActiveStationsResponseDTO } from '../dto/CountActiveStationsResponseDTO';
import { StatsRepository } from '../repositories/StatsRepository';

export class CountActiveStations {
  constructor(private readonly statsRepository: StatsRepository) {}

  async execute(query: CountActiveStationsDTO): Promise<CountActiveStationsResponseDTO> {
    return this.statsRepository.countActiveStations(query);
  }
}
