import log from 'npmlog';
import INI from 'ini';
import fs from 'fs-extra';
import {exec, spawn} from 'child-process-promise';

import * as paths from '../util/PathUtil';
import {IFilesDao} from './IFilesDao';
import {IServerIni} from '../model/IServerIni';
import { IProperties } from '../model/IProperties';
import { IServer } from '../model/IServer';



class FilesDao implements IFilesDao {

  async createServer(ini: IServerIni, userProps?: IProperties): Promise<IServer> {

    /* 0. SANITIZE VALUES */
    
    /* Generate ID */
    ini.id = ini.name.replace(/[\W_]+/g, '').toLowerCase();

    const isValidUsableRam  = [512, 1024, 2048, 4096, 6144].includes(ini.usableRam);

    if (!isValidUsableRam) {
      log.error(ini.id, `Invalid RAM value: ${ini.usableRam}`);
      throw new Error(`Usable RAM "${ini.usableRam}" is invalid`);
    }

    /* 1. CHECK IF PATHS EXISTS */
    const javaPath        = paths.getJavaBinPath(ini.javaName);
    const javaExists      = fs.existsSync(javaPath);

    const tmplPath        = paths.getTemplatePath(ini.templateName);
    const tmplExists      = fs.existsSync(tmplPath);

    const srvPath         = paths.getServerPath(ini.id);
    const srvExists       = fs.existsSync(srvPath);

    if (!javaExists) {
      log.error(ini.id, `Java version doesn't exist: ${javaPath}`);
      throw new Error(`Java version "${ini.javaName}" doesn't exist.`);
    }

    if (!tmplExists) {
      log.error(ini.id, `Template doesn't exist: ${tmplPath}`);
      throw new Error(`Template "${ini.templateName}" doesn't exist.`);
    }

    if (srvExists) {
      log.error(ini.id, `Server ${ini.id} already exists.`);
      throw new Error( `Server ID ${ini.id} already exists.`);
    }


    /* 2. COPY TEMPLATE CONTENT TO NEW SERVER DIR */
    log.info(ini.id, 'Copying templates');
    fs.mkdirSync(srvPath);
    fs.copySync(tmplPath, srvPath);


    /* 3. GENERATE SEKAI INI FILE */
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

    const iniPath = paths.getIniPath(ini.id);
    fs.writeFileSync(iniPath, INI.stringify(iniData), 'utf-8');


    /* 4. CHECK IF EULA AND SERVER.JAR EXISTS */
    const eulaPath      = paths.getEulaPath(ini.id);
    const eulaExists    = fs.existsSync(eulaPath);

    const srvJarPath    = paths.getServerJarPath(ini.id);
    const srvJarExists  = fs.existsSync(srvJarPath);


    /* 5. IF NO EULA AND THERE IS A SERVER JAR. RUN ONCE TO GENERATE FILES. */
    if (!eulaExists && srvJarExists) {
      log.info(ini.id, 'Generating server files');

      /* 5.1. RUN SERVER.JAR ONCE */
      const cdCmd   = `cd ${srvPath}`;
      const runCmd  = `${javaPath} -Xmx${ini.usableRam}M -Xms${ini.usableRam}M -jar server.jar nogui`;

      await exec(`${cdCmd} && ${runCmd}`);

      /* 5.2. ACCEPT EULA */
      log.info(ini.id, 'Accepting EULA');
      const eulaText = fs.readFileSync(eulaPath, 'utf8')
                         .replaceAll('false', 'true');

      fs.writeFileSync(eulaPath, eulaText, 'utf8');
    }

    /* 6.0. SET SERVER.PROPERTIES */
    const srvPropsPath  = paths.getPropertiesPath(ini.id);
    let srvProps        = INI.parse(fs.readFileSync(srvPropsPath, 'utf8')) as IProperties;
    srvProps            = this.normalizeProperties(srvProps, userProps);

    fs.writeFileSync(srvPropsPath, INI.stringify(srvProps), 'utf8');

    /* Return sekai.ini data */
    log.info(ini.id, `Done!`);
    
    const result: IServer = {
      ini: iniData,
      props: srvProps,
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
    const props = <IProperties> INI.parse(propsContent);

    ini.id = srvId;

    const out: IServer = {ini, props};
    
    return out;
  }



  /**
   * Doesn't assume any default values for the server.properties.
   * It keeps the value from defaultProps.
   */
  normalizeProperties(defaultProps: IProperties, userProps?: IProperties): IProperties {
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

export default FilesDao;
