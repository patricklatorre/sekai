import {Router} from 'express';
import IServerServiceAlpha from '../service/IServerServiceAlpha';
import ServerService from '../service/ServerService';
import { getBinPath } from '../util/path-util';

const router = Router();

const serverService: IServerServiceAlpha = new ServerService();

router.post('/api/server', (req, res) => {
  
});

router.get('/api/server', (req, res) => {
  res.json(getBinPath());
});

router.get('/api/server/:id', (req, res) => {
  let server = serverService.getById(req.params.id);
  res.json(server);
});

router.patch('/api/server/:id', (req, res) => {
  
});

router.delete('/api/server/:id', (req, res) => {
  
});

export default router;