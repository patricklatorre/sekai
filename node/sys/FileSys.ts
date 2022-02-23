import { IServerConfig } from "../model/IServerConfig";
import { IServerIni } from "../model/IServerIni";
import { IServerProps } from "../model/IServerProps";
import { IFileSys } from "./IFileSys";

import INI from 'ini';
import fs from 'fs-extra';
import log from 'npmlog';
import * as paths from '../util/PathUtil';

class FileSys implements IFileSys {

  async copyTemplate(srvId: string, templateName: string): Promise<void> {
    /* 1. CHECK IF PATHS EXISTS */
    const tmplPath        = paths.getTemplatePath(templateName);
    const tmplExists      = fs.existsSync(tmplPath);

    const srvPath         = paths.getServerPath(srvId);
    const srvExists       = fs.existsSync(srvPath);

    if (!tmplExists) {
      log.error(srvId, `Template doesn't exist: ${tmplPath}`);
      throw new Error(`Template "${templateName}" doesn't exist.`);
    }

    if (srvExists) {
      log.error(srvId, `Server ${srvId} already exists.`);
      throw new Error( `Server ID ${srvId} already exists.`);
    }

    await fs.mkdir(srvPath);
    await fs.copy(tmplPath, srvPath);
  }


  async acceptEula(srvId: string): Promise<void> {
    const path      = paths.getEulaPath(srvId);

    if (!fs.existsSync(path)) {
      log.error(srvId, `eula.txt not found`);
      throw new Error(`eula.txt not found`);
    }

    let text  = await fs.readFile(path, 'utf8')
    text = text.replaceAll('false', 'true');
    await fs.writeFile(path, text, 'utf8');
  }
  
  
  async listJavaNames(): Promise<string[]> {
    const path = paths.getJavaVersionsPath();

    if (!fs.existsSync(path)) {
      throw new Error('Java versions folder not found');
    }

    const files = await fs.readdir(path, { withFileTypes: true });

    return files
        .filter(f => f.isDirectory())
        .map(f => f.name);
  }
  
  
  async listServerIds(): Promise<string[]> {
    const path = paths.getServersPath();

    if (!fs.existsSync(path)) {
      throw new Error('Servers folder not found');
    }

    const files = await fs.readdir(path, { withFileTypes: true });

    return files
        .filter(f => f.isDirectory())
        .map(f => f.name);
  }
  

  async listServers(): Promise<IServerConfig[]> {
    const ids = await this.listServerIds();
    const servers: IServerConfig[] = [];
    
    for (const id of ids) {
      const srv = await this.getServerMetadata(id);
      srv.ini.id = id;
      servers.push(srv);
    }

    return servers;
  }


  async listTemplateNames(): Promise<string[]> {
    const path = paths.getTemplatesPath();

    if (!fs.existsSync(path)) {
      throw new Error('Templates folder not found');
    }

    const files = await fs.readdir(path, { withFileTypes: true });

    return files
        .filter(f => f.isDirectory())
        .map(f => f.name);
  }
  
  
  async getServerMetadata(srvId: string): Promise<IServerConfig> {
    const ini   = await this.getIni(srvId);
    const props = await this.getProps(srvId);
    return {ini, props};
  }
  
  
  async saveServerMetadata(srvId: string, srv: IServerConfig): Promise<IServerConfig> {
    await this.saveIni(srvId, srv.ini);
    await this.saveProps(srvId, srv.props);
    return await this.getServerMetadata(srvId);
  }
  
  
  async getIni(srvId: string): Promise<IServerIni> {
    const path = paths.getIniPath(srvId);

    if (!fs.existsSync(path)) {
      log.error(srvId, `sekai.ini not found`);
      throw new Error(`sekai.ini not found`);
    }

    const text = await fs.readFile(path, 'utf8');
    const ini = <IServerIni> INI.parse(text);

    return ini;
  }
  
  
  async saveIni(srvId: string, ini: IServerIni): Promise<void> {
    const path = paths.getIniPath(srvId);

    // if (!fs.existsSync(path)) {
    //   log.error(srvId, `sekai.ini not found`);
    //   throw new Error(`sekai.ini not found`);
    // }

    await fs.writeFile(path, INI.stringify(ini), 'utf8');
  }
  
  
  async getProps(srvId: string): Promise<IServerProps> {
    const path = paths.getPropertiesPath(srvId);

    if (!fs.existsSync(path)) {
      log.error(srvId, `server.properties not found`);
      throw new Error(`server.properties not found`);
    }

    const text = await fs.readFile(path, 'utf8');
    const props = <IServerProps> INI.parse(text);

    return props;
  }
  
  
  async saveProps(srvId: string, props: IServerProps): Promise<void> {
    const path = paths.getPropertiesPath(srvId);

    // if (!fs.existsSync(path)) {
    //   log.error(srvId, `server.properties not found`);
    //   throw new Error(`server.properties not found`);
    // }

    await fs.writeFile(path, INI.stringify(props), 'utf8');
  }

}

export default FileSys;
