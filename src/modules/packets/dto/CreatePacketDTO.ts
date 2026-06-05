export interface CreatePacketDTO {
	noradId: number;
	latitude: number;
	longitude: number;
	altitude: number;
	rssi: number;
	snr: number;
	slantDistance: number;
	elevationAngle: number;
	frequencyError: number;
	crc: boolean;
	rawPayload: string | number[];
}
