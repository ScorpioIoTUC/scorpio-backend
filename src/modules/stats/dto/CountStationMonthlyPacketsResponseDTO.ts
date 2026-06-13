export interface CountStationMonthlyPacketsItemDTO {
  date: string;
  satelliteNoradId: number;
  satelliteDisplayName: string;
  count: number;
}

export interface CountStationMonthlyPacketsResponseDTO {
  stationUuid: string;
  days: number;
  data: CountStationMonthlyPacketsItemDTO[];
}
