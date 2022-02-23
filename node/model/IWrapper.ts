import { IServerConfig } from "./IServerConfig";

export enum ServerStatus {
  OFFLINE = 0,
  STARTING = 1,
  ONLINE = 2,
  STOPPING = 3,
}

export interface IWrapper {

  config: IServerConfig;
  status: ServerStatus;

  start(): Promise<ServerStatus>;
  stop(): Promise<ServerStatus>;

}