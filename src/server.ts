import express from 'express';
import { userRepository } from './modules/users/repositories/UserRepository';
import { stationRepository } from './modules/stations/repositories/StationRepository';
import { buildUserRoutes } from './routes/users.routes';
import { buildStationRoutes } from './routes/stations.routes';
import satellitesRoutes from './routes/satellites.routes';
import packetsRoutes from './routes/packets.routes';

const app = express();
const port = Number(process.env.PORT ?? 8432);

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello, World!');
});

app.use('/users', buildUserRoutes(userRepository));
app.use('/satellites', satellitesRoutes);
app.use('/stations', buildStationRoutes(stationRepository, userRepository));
app.use('/packets', packetsRoutes);

app.listen(port, '0.0.0.0', () => {
  console.log(`[API] Service running at http://192.168.1.119:${port}`);
});