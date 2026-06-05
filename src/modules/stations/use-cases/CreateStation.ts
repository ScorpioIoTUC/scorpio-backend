import { CreateStationDTO } from "../dto/CreateStationDTO";
import { StationRepository } from "../repositories/StationRepository";
import { UserRepository } from "../../users/repositories/UserRepository";
import { StationCredentials } from "../entities/Station";

export class CreateStation {
    constructor(
        private readonly stationRepository: StationRepository,
        private readonly userRepository: UserRepository,
    ) { }

    async execute(data: CreateStationDTO): Promise<StationCredentials | null> {
        const user = await this.userRepository.findById(data.ownerId);
        if (!user) return null;
        return this.stationRepository.create(data);
    }
}