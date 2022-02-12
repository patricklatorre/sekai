import { IProperties } from "./IProperties";
import { IServerIni } from "./IServerIni";

export interface IServer {
  ini: IServerIni;
  props: IProperties;
}
