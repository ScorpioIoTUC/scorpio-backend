import express from 'express';
import { buildUserRoutes } from './routes/users.routes';
import { buildStationRoutes } from './routes/stations.routes';
import { buildSatellitesRoutes } from './routes/satellites.routes';
import { buildPacketRoutes } from './routes/packets.routes';


const app = express();
const port = Number(process.env.PORT ?? 8432);

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello, World!');
});

app.use('/users', buildUserRoutes());
app.use('/satellites', buildSatellitesRoutes());
app.use('/stations', buildStationRoutes());
app.use('/packets', buildPacketRoutes());

app.listen(port, '0.0.0.0', () => {
  console.log(`[API] Service running at http://localhost:${port}`);
});