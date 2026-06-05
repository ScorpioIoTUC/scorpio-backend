import { Router } from 'express';
import { PacketController } from '../modules/packets/controllers/PacketController';
import { packetRepository } from '../modules/packets/repositories/PacketRepository';
import { satelliteRepository } from '../modules/satellites/repositories/SatelliteRepository';
import { stationRepository } from '../modules/stations/repositories/StationRepository';

export const buildPacketRoutes = (): Router => {
    const router = Router();
    const packetController = PacketController.build(packetRepository, stationRepository, satelliteRepository);

    router.get('/', packetController.list);
    router.post('/', packetController.create);
    return router;
}



export default buildPacketRoutes;