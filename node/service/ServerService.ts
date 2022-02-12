import FilesDao from "../dao/FilesDao";
import { IProperties } from "../model/IProperties";
import { IServer } from "../model/IServer";
import {IServerIni} from "../model/IServerIni";
import IServerServiceAlpha from "./IServerServiceAlpha";

class ServerService implements IServerServiceAlpha {
  
  // private filesDao = new FilesDao();

  getAll(): IServer[] {
    throw new Error("Method not implemented.");
  }

  getById(serverId: string): IServer {
    throw new Error("Method not implemented.");
  }


  create(name: string, templateId: string, port: number, ramUsage?: string, description?: string, properties?: IProperties): void {
    
  }
  
  
  run(serverId: string): void {
    throw new Error("Method not implemented.");
  }
  
  
  update(serverId: string, name: string, description?: string, port?: number, ramUsage?: string, properties?: IProperties): void {
    throw new Error("Method not implemented.");
  }
  
  
  delete(serverId: string): void {
    throw new Error("Method not implemented.");
  }

}

export default ServerService;