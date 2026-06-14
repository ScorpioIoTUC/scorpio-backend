import express from 'express';
import cors from 'cors';
import { initializeSocket } from './lib/socket';
import { buildUserRoutes } from './routes/users.routes';
import { buildStationRoutes } from './routes/stations.routes';
import { buildSatellitesRoutes } from './routes/satellites.routes';
import { buildPacketRoutes } from './routes/packets.routes';
import { buildStatsRoutes } from './routes/stats.routes';
import buildAuthRoutes from './routes/auth.routes';


const app = express();
const port = Number(process.env.PORT ?? 8432);
const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
const { server } = initializeSocket(app);

app.use(cors({
  origin: frontendUrl,
  credentials: true,
}));

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello, World!');
});

app.use('/users', buildUserRoutes());
app.use('/satellites', buildSatellitesRoutes());
app.use('/stations', buildStationRoutes());
app.use('/packets', buildPacketRoutes());
app.use('/stats', buildStatsRoutes());
app.use('/auth', buildAuthRoutes());

server.listen(port, '0.0.0.0', () => {
  console.log(`[API] Service running at http://localhost:${port}`);
});
