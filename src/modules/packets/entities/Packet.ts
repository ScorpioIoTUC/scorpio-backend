export interface Packet {
  id: number;
  stationId: number;
  satelliteId: number;
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
}