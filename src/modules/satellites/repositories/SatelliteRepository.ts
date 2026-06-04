import { ListSatellitesDTO } from '../dto/ListSatellitesDTO';
import { ListSatellitesResponseDTO } from '../dto/ListSatellitesResponseDTO';
import { UpsertSatelliteDTO } from '../dto/UpsertSatelliteDTO';
import { UpsertSatellitesResultDTO } from '../dto/UpsertSatellitesResultDTO';
import { PrismaSatelliteRepository } from './PrismaSatelliteRepository';

export interface SatelliteRepository {
  findAll(query: ListSatellitesDTO): Promise<ListSatellitesResponseDTO>;
  upsertMany(satellites: UpsertSatelliteDTO[]): Promise<UpsertSatellitesResultDTO>;
}

export const satelliteRepository: SatelliteRepository = new PrismaSatelliteRepository();
