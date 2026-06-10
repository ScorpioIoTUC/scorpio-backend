import { CreateStationDTO } from "../dto/CreateStationDTO";
import { StationRepository } from "../repositories/StationRepository";
import { StationCredentials } from "../entities/Station";

export class CreateStation {
    constructor(
        private readonly stationRepository: StationRepository,
    ) { }

    async execute(data: CreateStationDTO): Promise<StationCredentials | null> {
        return this.stationRepository.create(data);
    }
}