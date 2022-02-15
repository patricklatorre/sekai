import { AbstractIterator } from "abstract-leveldown";
import { rejects } from "assert";
import EncodingDown from "encoding-down"
import { LevelUp } from "levelup";
import MemDown from "memdown";
import { IServer } from "../model/IServer";
import { IServerIni } from "../model/IServerIni";
import { IServerProps } from "../model/IServerProps";
import { IMetadataStore } from "./IMetadataStore";

class FileSysCache implements IMetadataStore {

  /* In-memory db containing all IServer data. */
  // db = LevelUp(
  //   EncodingDown<string, IServer>(MemDown(), { valueEncoding: 'json' })
  // );

  private javaMap       = new Map<string, string>();
  private templateMap   = new Map<string, string>();
  private serverMap     = new Map<string, IServer>();


  async listJavaNames(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  
  
  listServerIds(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const ids = [...this.serverMap.keys()];
      resolve(ids);
    });
  }


  listServers(): Promise<IServer[]> {
    return new Promise((resolve, reject) => {
      const servers: IServer[] = [];

      for (const [srvId, srv] of Object.entries(this.serverMap)) {
        srv.ini.id = srvId;
        servers.push(srv);
      }

      resolve(servers);
    });
  }
  
  
  listTemplateNames(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  
  
  getServerMetadata(srvId: string): Promise<IServer> {
    return new Promise((resolve, reject) => {
      const srv = this.serverMap.get(srvId);
      
      if (srv !== undefined) {
        srv.ini.id = srvId;
        resolve(srv);
      } else {
        reject(`Server ${srvId} doesn't exist.`);
      }
    });
  }
  
  
  saveServerMetadata(srvId: string, srv: IServer): Promise<void> {
    return new Promise((resolve, reject) => {
      srv.ini.id = srvId;
      this.serverMap.set(srvId, srv);
      resolve();
    });
  }
  
  
  async getIni(srvId: string): Promise<IServerIni> {
    const srv = await this.getServerMetadata(srvId);
    srv.ini.id = srvId;
    return srv.ini;
  }
  
  
  async saveIni(srvId: string, ini: IServerIni): Promise<void> {
    const srv = await this.getServerMetadata(srvId);
    srv.ini = ini;
    srv.ini.id = srvId;
    await this.saveServerMetadata(srvId, srv);
  }
  
  
  async getProps(srvId: string): Promise<IServerProps> {
    const srv = await this.getServerMetadata(srvId);
    srv.ini.id = srvId;
    return srv.props;
  }
  
  
  async saveProps(srvId: string, props: IServerProps): Promise<void> {
    const srv = await this.getServerMetadata(srvId);
    srv.props = props;
    srv.ini.id = srvId;
    await this.saveServerMetadata(srvId, srv);
  }

}

export default FileSysCache;