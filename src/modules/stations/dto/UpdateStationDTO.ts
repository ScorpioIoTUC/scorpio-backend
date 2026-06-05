export interface UpdateStationDTO {
    name?: string;
    latitude?: number;
    longitude?: number;
    altitude?: number;
    decoderConfig?: number[] | Uint8Array | null;
}