export interface PacketListItemDTO {
  id: number;
  stationId: number;
  stationUuid: string;
  satelliteId: number;
  satelliteNoradId: number;
  satelliteDisplayName: string;
  satelliteLatitude: number;
  satelliteLongitude: number;
  satelliteAltitude: number;
  slantDistance: number;
  angleElevation: number;
  rssi: number;
  snr: number;
  frequencyError: number;
  crc: boolean;
  rawPayload: number[];
  createdAt: Date;
}

export interface ListPacketsResponseDTO {
  data: PacketListItemDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}