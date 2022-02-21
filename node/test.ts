import log, { error } from 'npmlog';
import express from 'express';
import path from 'path';
import ServerService from './service/ServerService';
import setup from './setup';
import { IServerIni } from './model/IServerIni';
import { IServer } from './model/IServer';

async function testFunc(runTest: boolean) {

  if (!runTest) { 
    return;
  }

  const serverService = new ServerService();

  const testSrvs: IServer[] = [
    {
      ini: {
        name          : '0 Test Server (runnable)',
        templateName  : 'Vanilla_1.18.1',
        javaName      : '17',
        usableRam     : 1024,
      },
      props: {
        "allow-flight": false,
        "online-mode": false,
        "server-ip": '',
        "server-port": 51111,
      },
    },
    {
      ini: {
        name          : '1 _ Test_Server',
        templateName  : 'Vanilla_1.18.1',
        javaName      : '17',
        usableRam     : 1024,
      },
      props: {},
    },
    {
      ini: {
        name          : '2@Test#   Server',
        templateName  : 'Vanilla_1.18.1',
        javaName      : '17',
        usableRam     : 2048,
      },
      props: {},
    },
    {
      ini: {
        name          : '----_3 Test Server',
        templateName  : 'Vanilla_1.18.1',
        javaName      : '17',
        // @ts-ignore
        usableRam     : 513,
      },
      props: {},
    },
    {
      ini: {
        name          : '4 Test Server',
        templateName  : 'Vanilla_1.18.1',
        javaName      : '17',
        usableRam     : 512,
      },
      props: {},
    },
  ];

  for (let i = 0; i < testSrvs.length; i++) {
    const srv = testSrvs[i];

    try {

      const newSrv = await serverService.createServer(srv.ini, srv.props);

      // Inject new ID
      testSrvs[i].ini.id = newSrv.ini.id;
      // log.info('debug', `id=${newSrv.ini.id}`);

      log.info('create', `Finished creating ${newSrv.ini.name}`);

    } catch (err) {
      log.error('', ''+err);
    }
  }

  // const runnableSrv = testSrvs[0];

  // try {
  //   if (runnableSrv.ini.id !== undefined) {
  //     log.info('', `Attempting to run ${runnableSrv.ini.id}`);
  //     filesDao.runServer(runnableSrv.ini.id);
  //   } else {
  //     log.error('run', `Runnable server has no ID.`);
  //   }
  // } catch (err) {
  //   log.error('run', ''+err);
  // }

}

export default testFunc;
