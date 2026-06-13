import { CreatePacketDTO } from '../dto/CreatePacketDTO';
import { DeletePacketsDTO } from '../dto/DeletePacketsDTO';
import { ListPacketsDTO } from '../dto/ListPacketsDTO';
import { ListPacketsResponseDTO } from '../dto/ListPacketsResponseDTO';
import { PrismaPacketRepository } from './PrismaPacketRepository';

export interface PacketRepository {
	create(data: CreatePacketDTO, stationId: number, satelliteId: number): Promise<void>;
	findAll(query: ListPacketsDTO): Promise<ListPacketsResponseDTO>;
	deleteAll(query: DeletePacketsDTO): Promise<void>;
}

export const packetRepository: PacketRepository = new PrismaPacketRepository();
