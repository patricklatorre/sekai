import {IServer} from "../model/IServer";

interface IServerServiceAlpha {

  getById(
    serverId: string
  ): IServer;

  getAll(): IServer[];

  create(
    name: string,
    templateId: string,
    port: number,
    ramUsage?: string,
    description?: string,
    properties?: string,
  ): void;


  run(
    serverId: string,
  ): void;


  update(
    name: string,
    description?: string,
    port?: number,
    ramUsage?: string,
    properties?: string,
  ): void;


  delete(
    serverId: string
  ): void;

}

export default IServerServiceAlpha;