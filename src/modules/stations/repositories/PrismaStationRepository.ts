import { CreateStationDTO } from "../dto/CreateStationDTO";
import { ListStationsDTO } from "../dto/ListStationsDTO";
import { UpdateStationDTO } from "../dto/UpdateStationDTO";
import { StationRepository } from "./StationRepository";
import { Station, StationCredentials } from "../entities/Station";
import { prisma } from '../../../lib/prisma';
import crypto from "crypto";
import type { Station as PrismaStation } from '../../../generated/prisma/client';


const generateOwnerKey = (): { ownerKey: string; ownerKeyHash: string } => {
    const ownerKey = crypto.randomBytes(32).toString('base64url');
    const ownerKeyHash = crypto.createHash('sha256').update(ownerKey).digest('hex');
    return { ownerKey, ownerKeyHash };
};

const toDomainStation = (station: PrismaStation): Station => ({
    id: station.id,
    uuid: station.uuid,
    name: station.name,
    latitude: station.latitude,
    longitude: station.longitude,
    altitude: station.altitude,
    status: station.status,
    createdAt: station.creation_date,
    lastSeen: station.last_seen,
    ownerId: station.owner_id,
    decoderConfig: station.decoder_config ? Array.from(station.decoder_config) : null,
});

const toDomainStationCredentials = (station: PrismaStation, key: string, keyHash: string): StationCredentials => ({
    stationUuid: station.uuid,
    name: station.name,
    ownerId: station.owner_id,
    ownerKey: key,
    ownerKeyHash: keyHash,
});

const toPrismaDecoderConfig = (decoderConfig: UpdateStationDTO['decoderConfig']): Uint8Array<ArrayBuffer> | null | undefined => {
    if (decoderConfig === undefined) {
        return undefined;
    }
    if (decoderConfig === null) {
        return null;
    }
    return Uint8Array.from(decoderConfig) as Uint8Array<ArrayBuffer>;
};

export class PrismaStationRepository implements StationRepository {
    async create(data: CreateStationDTO): Promise<StationCredentials | null> {
        const stationUuid = crypto.randomUUID();
        const { ownerKey, ownerKeyHash } = generateOwnerKey();
        const creationDate = new Date();
        const station = await prisma.station.create({
            data: {
                name: data.name,
                uuid: stationUuid,
                latitude: data.latitude,
                longitude: data.longitude,
                altitude: data.altitude,
                status: true, // Default status
                creation_date: creationDate,
                last_seen: creationDate,
                owner_id: data.ownerId,
                owner_key_hash: ownerKeyHash,
            },
        });
        return toDomainStationCredentials(station, ownerKey, ownerKeyHash);
    }

    async findAll(query: ListStationsDTO): Promise<Station[]> {
        const limit = query.limit ?? 100;
        const page = query.page ?? 1;
        const stations = await prisma.station.findMany({
            where: query.ownerId !== undefined ? { owner_id: query.ownerId } : undefined,
            orderBy: { id: 'asc' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return stations.map(toDomainStation);
    }

    async findByUuid(uuid: string): Promise<Station | null> {
        const station = await prisma.station.findUnique({
            where: { uuid },
        });
        return station ? toDomainStation(station) : null;
    }

    async findAuthByUuid(uuid: string): Promise<{ id: number; uuid: string; ownerKeyHash: string } | null> {
        const station = await prisma.station.findUnique({
            where: { uuid },
            select: {
                id: true,
                uuid: true,
                owner_key_hash: true,
            },
        });
        return station
            ? {
                id: station.id,
                uuid: station.uuid,
                ownerKeyHash: station.owner_key_hash,
            }
            : null;
    }

    async findByOwnerId(uuid: string, ownerId: number): Promise<Station | null> {
        const station = await prisma.station.findFirst(
            { where: { owner_id: ownerId, uuid: uuid } }
        );
        return station ? toDomainStation(station) : null;
    }

    async update(uuid: string, data: UpdateStationDTO): Promise<Station | null> {
        const existingStation = await prisma.station.findUnique({
            where: { uuid },
        });

        if (!existingStation) {
            return null;
        }
        const updatedStation = await prisma.station.update({
            where: { uuid },
            data: {
                name: data.name ?? existingStation.name,
                latitude: data.latitude ?? existingStation.latitude,
                longitude: data.longitude ?? existingStation.longitude,
                altitude: data.altitude ?? existingStation.altitude,
                decoder_config: toPrismaDecoderConfig(data.decoderConfig) ?? existingStation.decoder_config,
            },
        });
        return toDomainStation(updatedStation);
    }

    async updateLastSeen(uuid: string): Promise<void> {
        await prisma.station.update({
            where: { uuid },
            data: {
                last_seen: new Date(),
            },
        });
    }

    async delete(uuid: string): Promise<boolean> {
        const existingStation = await prisma.station.findUnique({
            where: { uuid },
        });
        if (!existingStation) {
            return false;
        }
        await prisma.station.delete({
            where: { uuid },
        });
        return true;
    }

    async regenerateKey(uuid: string): Promise<StationCredentials | null> {
        const existingStation = await prisma.station.findUnique({
            where: { uuid },
        });
        if (!existingStation) {
            return null;
        }
        const { ownerKey, ownerKeyHash } = generateOwnerKey();
        const station = await prisma.station.update({
            where: { uuid },
            data: { owner_key_hash: ownerKeyHash },
        });
        return toDomainStationCredentials(station, ownerKey, ownerKeyHash);
    }
}