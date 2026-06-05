import { ListPacketsDTO } from '../dto/ListPacketsDTO';
import { ListPacketsResponseDTO } from '../dto/ListPacketsResponseDTO';
import { PacketRepository } from '../repositories/PacketRepository';

export class ListPackets {
  constructor(private readonly packetRepository: PacketRepository) {}

  async execute(query: ListPacketsDTO): Promise<ListPacketsResponseDTO> {
    return this.packetRepository.findAll(query);
  }
}