import { IServer } from "../model/IServer";
import { IServerIni } from "../model/IServerIni";
import { IServerProps } from "../model/IServerProps";

export interface IMetadataStore {

    listJavaNames(): Promise<string[]>;

    listServerIds(): Promise<string[]>;
  
    listTemplateNames(): Promise<string[]>;
  
    getServerMetadata(srvId: string): Promise<IServer>;
  
    saveServerMetadata(srvId: string, srv: IServer): Promise<void>;
    
    getIni(srvId: string): Promise<IServerIni>;
  
    saveIni(srvId: string, ini: IServerIni): Promise<void>;
    
    getProps(srvId: string): Promise<IServerProps>;
  
    saveProps(srvId: string, props: IServerProps): Promise<void>;

}
