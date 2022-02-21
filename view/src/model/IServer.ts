import { IServerProps } from "./IServerProps";
import { IServerIni } from "./IServerIni";

export interface IServer {
  ini: IServerIni;
  props: IServerProps;
}
