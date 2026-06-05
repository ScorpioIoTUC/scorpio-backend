export interface UpsertSatelliteDTO {
  noradId: number;
  displayName: string;
  objectId: string | null;
  epoch: Date | null;
  meanMotion: number | null;
  eccentricity: number | null;
  inclination: number | null;
  raOfAscNode: number | null;
  argOfPericenter: number | null;
  meanAnomaly: number | null;
  bstar: number | null;
  meanMotionDot: number | null;
  meanMotionDdot: number | null;
  tle1: string | null;
  tle2: string | null;
  tleUpdatedAt: Date | null;
}
