import {Router} from 'express';
import FilesDao from '../dao/FilesDao';
import { IFilesDao } from '../dao/IFilesDao';
import { IServer } from '../model/IServer';
import { IServerIni } from '../model/IServerIni';
import IServerServiceAlpha from '../service/IServerServiceAlpha';
import ServerService from '../service/ServerService';
import * as paths from '../util/PathUtil';

const router = Router();

// const serverService: IServerServiceAlpha = new ServerService();

const filesDao: IFilesDao = new FilesDao();

router.post('/api/server', async (req, res, next) => {
  try {

    const srv = <IServer> req.body;
    console.dir(srv);
    const result = await filesDao.createServer(srv.ini, srv.props);
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
    const srv = filesDao.getServer(id);
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