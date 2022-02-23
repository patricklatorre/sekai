import { IServerConfig } from "../model/IServerConfig";
import { IServerIni } from "../model/IServerIni";
import { IServerProps } from "../model/IServerProps";

export interface IMetadataStore {

    listJavaNames(): Promise<string[]>;

    listServerIds(): Promise<string[]>;
  
    listTemplateNames(): Promise<string[]>;

    listServers(): Promise<IServerConfig[]>;
  
    getServerMetadata(srvId: string): Promise<IServerConfig>;
  
    saveServerMetadata(srvId: string, srv: IServerConfig): Promise<IServerConfig>;
    
    getIni(srvId: string): Promise<IServerIni>;
  
    saveIni(srvId: string, ini: IServerIni): Promise<void>;
    
    getProps(srvId: string): Promise<IServerProps>;
  
    saveProps(srvId: string, props: IServerProps): Promise<void>;

}
