import { IProperties } from "../model/IProperties";
import { IServer } from "../model/IServer";
import {IServerIni} from "../model/IServerIni";

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
    properties?: IProperties,
  ): void;


  run(
    serverId: string,
  ): void;


  update(
    serverId: string,
    name: string,
    description?: string,
    port?: number,
    ramUsage?: string,
    properties?: IProperties,
  ): void;


  delete(
    serverId: string
  ): void;

}

export default IServerServiceAlpha;