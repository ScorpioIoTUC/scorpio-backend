export interface ListPacketsDTO {
	page?: number;
	limit?: number;
	stationUuid?: string;
	satelliteNoradId?: number;
	satelliteDisplayName?: string;
	satelliteLatitude?: number;
	satelliteLongitude?: number;
	startDate?: Date;
	endDate?: Date;
}
