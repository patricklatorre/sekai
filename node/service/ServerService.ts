import log from 'npmlog';
import INI from 'ini';
import fs from 'fs-extra';
import {exec, spawn} from 'child-process-promise';

import * as paths from '../util/PathUtil';
import {IServerService} from './IServerService';
import {IServerIni} from '../model/IServerIni';
import { IServerProps } from '../model/IServerProps';
import { IServer } from '../model/IServer';
import FileSys from '../dao/FileSys';
import { IFileSys } from '../dao/IFileSys';


class ServerService implements IServerService {

  private fileSys: IFileSys = new FileSys();

  async createServer(ini: IServerIni, userProps?: IServerProps): Promise<IServer> {

    /* 0. SANITIZE VALUES */
    
    /* Generate ID */
    ini.id = ini.name.replace(/[\W_]+/g, '').toLowerCase();

    /* Validate usableRam value */
    const isValidUsableRam  = [512, 1024, 2048, 4096, 6144].includes(ini.usableRam);

    if (!isValidUsableRam) {
      log.error(ini.id, `Invalid RAM value: ${ini.usableRam}`);
      throw new Error(`Usable RAM "${ini.usableRam}" is invalid`);
    }


    /* 0.2 CHECK IF JAVA VERSION EXISTS */
    const javaPath        = paths.getJavaBinPath(ini.javaName);
    const javaExists      = fs.existsSync(javaPath);
    
    if (!javaExists) {
      log.error(ini.id, `Java version doesn't exist: ${javaPath}`);
      throw new Error(`Java version "${ini.javaName}" doesn't exist.`);
    }


    /* 1. COPY TEMPLATE FILES TO SERVER DIR */
    log.info(ini.id, 'Copying templates');
    await this.fileSys.copyTemplate(ini.id, ini.templateName);    

    /* 2. GENERATE SEKAI INI FILE */
    log.info(ini.id, 'Generating sekai.ini file');

    const iniData: IServerIni = {
      /* NOTE: the ID is the directory name itself */
      id            : ini.id,
      name          : ini.name,
      templateId    : ini.templateName,
      templateName  : ini.templateName,
      javaId        : ini.javaName,
      javaName      : ini.javaName,
      usableRam     : ini.usableRam,
    };

    await this.fileSys.saveIni(ini.id, iniData);


    /* 3. CHECK IF EULA AND SERVER.JAR EXISTS */
    const srvPath       = paths.getServerPath(ini.id);

    const eulaPath      = paths.getEulaPath(ini.id);
    const eulaExists    = fs.existsSync(eulaPath);

    const srvJarPath    = paths.getServerJarPath(ini.id);
    const srvJarExists  = fs.existsSync(srvJarPath);


    /* 4. IF NO EULA AND THERE IS A SERVER JAR. RUN ONCE TO GENERATE FILES. */
    if (!eulaExists && srvJarExists) {
      // TODO: This portion should be done by the Runner
      log.info(ini.id, 'Generating server files');

      /* 4.1. RUN SERVER.JAR ONCE */
      const cdCmd   = `cd ${srvPath}`;
      const runCmd  = `${javaPath} -Xmx${ini.usableRam}M -Xms${ini.usableRam}M -jar server.jar nogui`;

      await exec(`${cdCmd} && ${runCmd}`);

      /* 4.2. ACCEPT EULA */
      log.info(ini.id, 'Accepting EULA');
      await this.fileSys.acceptEula(ini.id);
    }

    /* 5.0. SET SERVER.PROPERTIES */
    let defaultProps    = await this.fileSys.getProps(ini.id);
    let finalProps      = this.applyUserProperties(defaultProps, userProps);
    
    await this.fileSys.saveProps(ini.id, finalProps);


    /* Return sekai.ini data */
    log.info(ini.id, `Done!`);
    
    const result: IServer = {
      ini: iniData,
      props: finalProps,
    };

    return result;
  }



  runServer(srvId: string): IServer {

    log.info(srvId, 'Fetching server files');

    /* 1. FETCH SERVER - SHOULD ALSO CHECK IF PATHS EXISTS */
    let srv;

    try {
      srv = this.getServer(srvId);
      srv.ini.id = srvId;
    } catch (err) {
      log.error(srvId, ''+err);
      throw new Error(''+err);
    }

    /* 2. CHECK IF JAVA AND SERVER.JAR EXIST */
    const javaPath        = paths.getJavaBinPath(srv.ini.javaName);
    const javaExists      = fs.existsSync(javaPath);

    if (!javaExists) {
      log.error(srvId, `Java version doesn't exist: ${javaPath}`);
      throw new Error(`Java version "${srv.ini.javaName}" doesn't exist.`);
    }

    const srvJarPath      = paths.getServerJarPath(srvId);
    const srvJarExists    = fs.existsSync(srvJarPath);

    if (!srvJarExists) {
      log.error(srvId, `server.jar not found: ${javaPath}`);
      throw new Error(`server.jar not found.`);
    }

    /* Sanitize usableRam value */
    let usableRam = Number(srv.ini.usableRam);
    const isUsableRamValid = [512, 1024, 2048, 4096, 6144].includes(usableRam);
    
    if (!isUsableRamValid) {
      log.error(srvId, `Invalid usable RAM: ${usableRam}`);
      throw new Error(`Invalid usable RAM: ${usableRam}`);
    }

    /* 3. RUN SERVER AS HEADLESS PROCESS */
    log.info(srvId, 'Starting up');

    const srvPath = paths.getServerPath(srvId);

    const cdCmd   = `cd ${srvPath}`;
    const javaCmd = `${javaPath} -Xmx${usableRam}M -Xms${usableRam}M -jar server.jar nogui`;

    exec(`start cmd /C "${cdCmd} && ${javaCmd}"`);

    log.info(srvId, 'Done! It may take a minute or more to be joinable.');

    return {...srv};
  }



  /** 
   * Get existing sekai-managed server. 
   */
  getServer(srvId: string): IServer {
    const srvPath         = paths.getServerPath(srvId);
    const srvExists       = fs.existsSync(srvPath);

    if (!srvExists) {
      log.error(srvId, `server.jar not found. ${srvPath}`);
      throw new Error( `server.jar not found.`);
    }

    const iniPath         = paths.getIniPath(srvId);
    const iniExists       = fs.existsSync(iniPath);

    if (!iniExists) {
      log.error(srvId, `sekai.ini not found. ${iniPath}`);
      throw new Error( `sekai.ini not found.`);
    }

    const propsPath       = paths.getPropertiesPath(srvId);
    const propsExists     = fs.existsSync(propsPath);

    if (!propsExists) {
      log.error(srvId, `server.properties not found. ${propsPath}`);
      throw new Error( `server.properties not found.`);
    }

    const iniContent    = fs.readFileSync(iniPath, 'utf8');
    const propsContent  = fs.readFileSync(propsPath, 'utf8');

    const ini   = <IServerIni> INI.parse(iniContent);
    const props = <IServerProps> INI.parse(propsContent);

    ini.id = srvId;

    const out: IServer = {ini, props};
    
    return out;
  }



  /**
   * Doesn't assume any default values for the server.properties.
   * It keeps the value from defaultProps.
   */
  applyUserProperties(defaultProps: IServerProps, userProps?: IServerProps): IServerProps {
    if (userProps === undefined) {
      return defaultProps;
    }

    for (const key of Object.keys(defaultProps)) {
      // @ts-ignore
      if (userProps[key] !== undefined) {
        // @ts-ignore
        defaultProps[key] = userProps[key];
      }
    }

    return defaultProps;
  }
}

export default ServerService;
