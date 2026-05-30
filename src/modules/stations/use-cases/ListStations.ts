import { Station } from '../entities/Station';
import { ListStationsDTO } from '../dto/ListStationsDTO';
import { StationRepository } from '../repositories/StationRepository';

export class ListStations {
  constructor(private readonly stationRepository: StationRepository) {}

  async execute(query: ListStationsDTO): Promise<Station[]> {
    return this.stationRepository.findAll(query);
  }
}