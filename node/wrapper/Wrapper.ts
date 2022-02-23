import log from "npmlog";
import { IServerConfig } from "../model/IServerConfig";
import { IWrapper, ServerStatus } from "../model/IWrapper";
import { getServerJarPath } from '../util/PathUtil';
import * as paths from '../util/PathUtil';
import fs from 'fs-extra';
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { getSettings } from "../settings";
import { PingMC } from "pingmc";

class Wrapper implements IWrapper {

  id: string;
  config: IServerConfig;
  status: ServerStatus;
  serverJarPath: string;
  childProcess: ChildProcessWithoutNullStreams | undefined;
  
  constructor(config: IServerConfig) {
    if (config.ini.id !== undefined) {
      this.id = config.ini.id;
    } else {
      throw new Error('Server config has no ID');
    }

    this.config = config;
    this.status = ServerStatus.OFFLINE;
    this.serverJarPath = getServerJarPath(this.id);
    this.childProcess = undefined; // 
  }

  async start(): Promise<ServerStatus> {
    const startingProm = new Promise<ServerStatus>(async (resolve, reject) => {
      this.status = ServerStatus.STARTING;

      log.info(this.id, 'Fetching server files');

      /* 1. CLONE CONFIG */
      let config = {...this.config};
  
      /* 2. CHECK IF JAVA AND SERVER.JAR EXIST */
      const javaPath        = paths.getJavaBinPath(config.ini.javaName);
      const javaExists      = fs.existsSync(javaPath);
  
      if (!javaExists) {
        log.error(this.id, `Java version doesn't exist: ${javaPath}`);
        this.status = ServerStatus.OFFLINE;
        resolve(ServerStatus.OFFLINE);
      }
  
      const srvJarPath      = paths.getServerJarPath(this.id);
      const srvJarExists    = fs.existsSync(srvJarPath);
  
      if (!srvJarExists) {
        log.error(this.id, `server.jar not found: ${javaPath}`);
        this.status = ServerStatus.OFFLINE;
        resolve(ServerStatus.OFFLINE);
      }
  
      /* Sanitize usableRam value */
      let usableRam = Number(config.ini.usableRam);
      const isUsableRamValid = [512, 1024, 2048, 4096, 6144].includes(usableRam);
      
      if (!isUsableRamValid) {
        log.error(this.id, `Invalid usable RAM: ${usableRam}`);
        this.status = ServerStatus.OFFLINE;
        resolve(ServerStatus.OFFLINE);
      }
  
      /* 3. RUN SERVER AS HEADLESS PROCESS */
      log.info(this.id, 'Starting up');

      const { detachServers } = getSettings();
      const srvPath = paths.getServerPath(this.id);
      const args = [`-Xmx${usableRam}M`, `-Xms${usableRam}M`, `-jar`, `server.jar`, `nogui`];

      // const cdCmd   = `cd ${srvPath}`;
      // const javaCmd = `${javaPath} -Xmx${usableRam}M -Xms${usableRam}M -jar server.jar nogui`;

      this.childProcess = spawn(javaPath, args, {
        cwd: srvPath,
        shell: detachServers,
      });
      
      const rule0 = /^\[[\d:]{8}\] \[Server thread\/INFO\]: Done.*/i;
      const rule1 = /^\[[\d:]{8}\] \[Server thread\/INFO\] \[minecraft\/DedicatedServer\]: Done.*/i;

      const pipeLogs = (data: string) => {
        const line  = `${data}`.trim();
        
        if (!detachServers) {
          log.info(this.id, line);
        }
      }

      const doneListener = (data: string) => {
        const line  = `${data}`.trim();

        if (rule0.test(line) || rule1.test(line)) {
          this.status = ServerStatus.ONLINE;
          log.info(this.id, 'Server is online.');
          this.childProcess?.removeListener('data', doneListener);
          resolve(ServerStatus.ONLINE);
        }
      }

      const closeListener = () => {
        this.status = ServerStatus.OFFLINE;
        this.childProcess = undefined;
        log.info(this.id, `Server stopped.`);
        resolve(ServerStatus.OFFLINE);
      }

      this.childProcess.stdout.on('data', pipeLogs);
      this.childProcess.stdout.on('data', doneListener);
      this.childProcess.on('close', closeListener);
    });

    return startingProm;
  }


  async stop(): Promise<ServerStatus> {
    
    const stoppingProm = new Promise<ServerStatus>(async (resolve, reject) => {
      if (this.childProcess === undefined || this.status === ServerStatus.OFFLINE) {
        log.info(this.id, 'Stop server attempt failed. Server is already offline.');
        resolve(ServerStatus.OFFLINE);
      }

      this.status = ServerStatus.STOPPING;

      this.childProcess?.kill('SIGKILL');
    
      const port  = this.config.props['server-port'];
      const host  = (this.config.props['server-ip'] === '')
                  ? 'localhost'
                  : this.config.props['server-ip'];

      const pingmc = new PingMC(`${host}:${port}`);
    
      try {
        log.info(this.id, 'Pinging server to validate if it is offline.');
        const res = await pingmc.ping();
        this.status = ServerStatus.ONLINE;
        log.info(this.id, 'Stop server attempt failed. Server can still be pinged.');
        resolve(ServerStatus.ONLINE);
      } catch (err) {
        this.childProcess = undefined;
        this.status = ServerStatus.OFFLINE;
        resolve(ServerStatus.OFFLINE);
      }
    });

    return stoppingProm;
  }

}

export default Wrapper;
