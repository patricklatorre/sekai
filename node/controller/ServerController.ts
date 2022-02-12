import {Router} from 'express';
import ServerService from '../service/ServerService';
import { IServer } from '../model/IServer';
import * as paths from '../util/PathUtil';
import { IServerService } from '../service/IServerService';

const router = Router();

const serverService: IServerService = new ServerService();

router.post('/api/server', async (req, res, next) => {
  try {

    const srv = <IServer> req.body;
    console.dir(srv);
    const result = await serverService.createServer(srv.ini, srv.props);
    res.status(201).json(result);

  } catch (err) {
    next(err);
  }
});

router.get('/api/server', (req, res, next) => {
  try {

    res.status(200).json({});

  } catch (err) {
    next(err);
  }
});

router.get('/api/server/:id', (req, res, next) => {
  try {

    const id  = req.params.id;
    const srv = serverService.getServer(id);
    res.json(srv);
  
  } catch (err) {
    next(err);
  }
});

router.patch('/api/server/:id', (req, res, next) => {
  
});

router.delete('/api/server/:id', (req, res, next) => {
  
});

export default router;