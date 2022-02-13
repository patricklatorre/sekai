import {Router} from 'express';
import ServerService from '../service/ServerService';
import { IServer } from '../model/IServer';
import * as paths from '../util/PathUtil';
import { IServerService } from '../service/IServerService';
import log from 'npmlog';
import FileSys from '../dao/FileSys';

const router = Router();

const serverService: IServerService = new ServerService();

// TODO: Remove after testing.
const fileSys = new FileSys();

router.post('/api/server', async (req, res, next) => {
  try {

    const srv = <IServer> req.body;
    const result = await serverService.createServer(srv.ini, srv.props);
    res.status(201).json(result);

  } catch (err) {

    log.error('', ''+err);
    res.status(500).json({ error: ''+err });
  }
});

router.get('/api/server', async (req, res, next) => {
  try {

    const ids = await fileSys.listServerIds();
    res.status(200).json(ids);

  } catch (err) {

    log.error('', ''+err);
    res.status(500).json({ error: ''+err });

  }
});

router.get('/api/server/:id', (req, res, next) => {
  try {

    const id  = req.params.id;
    const srv = serverService.getServer(id);
    res.json(srv);
  
  } catch (err) {

    log.error('', ''+err);
    res.status(500).json({ error: ''+err });

  }
});

router.patch('/api/server/:id', (req, res, next) => {
  
});

router.delete('/api/server/:id', (req, res, next) => {
  
});

export default router;