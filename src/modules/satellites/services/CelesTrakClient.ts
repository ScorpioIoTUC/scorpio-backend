import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export interface CelesTrakClient {
  downloadActiveSatellites(): Promise<string>;
}

export class FetchCelesTrakClient implements CelesTrakClient {
  private readonly useMockData = process.env.SATELLITES_USE_MOCK_DATA !== 'false';
  private readonly mockDataPath = resolve(process.cwd(), 'data', 'active.json');
  private readonly activeSatellitesUrl =
    'https://celestrak.org/NORAD/elements/gp.php?GROUP=ACTIVE&FORMAT=JSON';

  async downloadActiveSatellites(): Promise<string> {
    // if (this.useMockData) {
    //   return readFile(this.mockDataPath, 'utf-8');
    // }

    const response = await fetch(this.activeSatellitesUrl);

    if (!response.ok) {
      throw new Error(`Failed to download active satellites from CelesTrak. Status: ${response.status}`);
    }

    return response.text();
  }
}
