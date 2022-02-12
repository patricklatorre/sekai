import { IServer } from "../model/IServer";
import { IServerIni } from "../model/IServerIni";
import { IServerProps } from "../model/IServerProps";

export interface IMetadataStore {

    listJavaNames(): string[];

    listServerIds(): string[];
  
    listTemplateNames(): string[];
  
    getServerMetadata(srvId: string): IServer;
  
    saveServerMetadata(srvId: string, srv: IServer): IServer;
    
    getIni(srvId: string): IServerIni;
  
    saveIni(srvId: string, ini: IServerIni): void;
    
    getProps(srvId: string): IServerProps;
  
    saveProps(srvId: string, props: IServerProps): void;

}
