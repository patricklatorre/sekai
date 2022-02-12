import { IServer } from "../model/IServer";
import { IServerIni } from "../model/IServerIni";
import { IServerProps } from "../model/IServerProps";
import { IFileSys } from "./IFileSys";


class FileSys implements IFileSys {


  copyTemplate(srvId: string, templateName: string): void {
    throw new Error("Method not implemented.");
  }


  acceptEula(srvId: string): void {
    throw new Error("Method not implemented.");
  }


  listJavaNames(): string[] {
    throw new Error("Method not implemented.");
  }


  listServerIds(): string[] {
    throw new Error("Method not implemented.");
  }


  listTemplateNames(): string[] {
    throw new Error("Method not implemented.");
  }


  getServerMetadata(srvId: string): IServer {
    throw new Error("Method not implemented.");
  }


  saveServerMetadata(srvId: string, srv: IServer): IServer {
    throw new Error("Method not implemented.");
  }


  getIni(srvId: string): IServerIni {
    throw new Error("Method not implemented.");
  }


  saveIni(srvId: string, ini: IServerIni): void {
    throw new Error("Method not implemented.");
  }


  getProps(srvId: string): IServerProps {
    throw new Error("Method not implemented.");
  }


  saveProps(srvId: string, props: IServerProps): void {
    throw new Error("Method not implemented.");
  }


}
