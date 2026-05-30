import { Station, StationCredentials } from "../entities/Station";
import { CreateStationDTO } from "../dto/CreateStationDTO";
import { ListStationsDTO } from "../dto/ListStationsDTO";
import { UpdateStationDTO } from "../dto/UpdateStationDTO";
import { PrismaStationRepository } from "./PrismaStationRepository";

export interface StationRepository {
    create(data: CreateStationDTO): Promise<StationCredentials | null>;
    findAll(query: ListStationsDTO): Promise<Station[]>;
    findByUuid(uuid: string): Promise<Station | null>;
    update(uuid: string, data: UpdateStationDTO): Promise<Station | null>;
    delete(uuid: string): Promise<boolean>;
    regenerateKey(uuid: string): Promise<StationCredentials | null>;
}

export const stationRepository: StationRepository = new PrismaStationRepository();
