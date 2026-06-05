export interface Station {
    id: number;
    uuid: string;
    name: string;
    latitude: number;   
    longitude: number;
    altitude: number;
    status: boolean;
    createdAt: Date;
    lastSeen: Date;
    ownerId: number;
    decoderConfig: number[] | null;
}

export interface StationCredentials {
    stationUuid: string;
    name: string;
    ownerId: number;
    ownerKey: string;
    ownerKeyHash: string;
}