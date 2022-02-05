import {IServer} from "../model/IServer";
import IServerServiceAlpha from "./IServerServiceAlpha";

class ServerService implements IServerServiceAlpha {
  
  getAll(): IServer[] {
    throw new Error("Method not implemented.");
  }

  getById(serverId: string): IServer {
    throw new Error("Method not implemented.");
  }


  create(name: string, templateId: string, port: number, ramUsage?: string, description?: string, properties?: string): void {
    throw new Error("Method not implemented.");
  }
  
  
  run(serverId: string): void {
    throw new Error("Method not implemented.");
  }
  
  
  update(name: string, description?: string, port?: number, properties?: string): void {
    throw new Error("Method not implemented.");
  }
  
  
  delete(serverId: string): void {
    throw new Error("Method not implemented.");
  }

}

export default ServerService;