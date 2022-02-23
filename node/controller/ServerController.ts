import {Router} from 'express';
import ServerService from '../service/ServerService';
import { IServerConfig } from '../model/IServerConfig';
import * as paths from '../util/PathUtil';
import { IServerService } from '../service/IServerService';
import log from 'npmlog';
import FileSys from '../sys/FileSys';
import { getSettings, IPData, ISettings } from '../settings';

const router = Router();

const serverService: IServerService = new ServerService();

// TODO: Remove after testing.

router.post('/api/server', async (req, res, next) => {
  try {

    const srv = <IServerConfig> req.body;
    const result = await serverService.createServer(srv.ini, srv.props);
    res.status(201).json(result);

  } catch (err) {

    log.error('', ''+err);
    res.status(500).json({ error: ''+err });
  }
});

router.get('/api/serverid', async (req, res, next) => {
  try {

    const ids = await serverService.getServerIds();
    res.status(200).json(ids);

  } catch (err) {

    log.error('', ''+err);
    res.status(500).json({ error: ''+err });

  }
});

router.get('/api/server', async (req, res, next) => {
  try {

    const servers = await serverService.getServers();
    res.status(200).json(servers);

  } catch (err) {

    log.error('', ''+err);
    res.status(500).json({ error: ''+err });

  }
});

router.get('/api/server/:id', async (req, res, next) => {
  try {

    const id  = req.params.id;
    const srv = await serverService.getServer(id);
    res.json(srv);
  
  } catch (err) {

    log.error('', ''+err);
    res.status(500).json({ error: ''+err });

  }
});

router.get('/api/template', async (req, res, next) => {
  try {

    const templates = await serverService.getTemplates();
    res.json(templates);
  
  } catch (err) {

    log.error('', ''+err);
    res.status(500).json({ error: ''+err });

  }
});

router.get('/api/java', async (req, res, next) => {
  try {

    const javaVersions = await serverService.getJavaVersions();
    res.json(javaVersions);
  
  } catch (err) {

    log.error('', ''+err);
    res.status(500).json({ error: ''+err });

  }
});

router.get('/api/run/:id', async (req, res, next) => {
  try {

    const id  = req.params.id;
    const srv = await serverService.runServer(id);
    res.json(srv);
  
  } catch (err) {

    log.error('', ''+err);
    res.status(500).json({ error: ''+err });

  }
});

router.get('/api/stop/:id', async (req, res, next) => {
  try {

    const id  = req.params.id;
    const srv = await serverService.stopServer(id);
    res.json(srv);
  
  } catch (err) {

    log.error('', ''+err);
    res.status(500).json({ error: ''+err });

  }
});

router.patch('/api/server/:id', async (req, res, next) => {
  try {

    const srv = <IServerConfig> req.body;
    const result = await serverService.updateServer(req.params.id, srv);
    res.status(200).json(result);

  } catch (err) {

    log.error('', ''+err);
    res.status(500).json({ error: ''+err });
  }
});

router.delete('/api/server/:id', async (req, res, next) => {
  
});

router.get('/api/ping/:id', async (req, res, next) => {
  try {

    const id  = req.params.id;
    const isUp = await serverService.isServerUp(id);
    res.json(isUp);
  
  } catch (err) {

    log.error('', ''+err);
    res.status(500).json({ error: ''+err });

  }
});

router.get('/api/status/:id', async (req, res, next) => {
  try {

    const id  = req.params.id;
    const status = await serverService.getServerStatus(id);
    res.json(status);
  
  } catch (err) {

    log.error('', ''+err);
    res.status(500).json({ error: ''+err });

  }
});

router.get('/api/settings/ip', async (req, res, next) => {
  try {

    const settings = getSettings();

    const ips: IPData = {
      local: settings.ipAddress,
      vpn: settings.vpnIpAddress,
    };

    if (ips.local === '' || ips.local === undefined || ips.local === null) {
      ips.local = 'localhost';
    }

    if (ips.vpn === '' || ips.vpn === undefined || ips.vpn === null) {
      ips.vpn = 'localhost';
    }

    res.json(ips);
  
  } catch (err) {

    log.error('', ''+err);
    res.status(500).json({ error: ''+err });

  }
});

export default router;