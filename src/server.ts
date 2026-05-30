import express from 'express';
import { userRepository } from './modules/users/repositories/UserRepository';
import { buildUserRoutes } from './routes/users.routes';
import satellitesRoutes from './routes/satellites.routes';
import stationsRoutes from './routes/stations.routes';
import packetsRoutes from './routes/packets.routes';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello, World!');
});

app.use('/users', buildUserRoutes(userRepository));
app.use('/satellites', satellitesRoutes);
app.use('/stations', stationsRoutes);
app.use('/packets', packetsRoutes);

app.listen(port, () => {
  console.log(`[API] Service running at http://localhost:${port}`);
});