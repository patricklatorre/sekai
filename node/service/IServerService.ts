import { IServerProps } from "../model/IServerProps";
import { IServerConfig } from "../model/IServerConfig";
import { IServerIni } from "../model/IServerIni";
import { ServerStatus } from "../model/IWrapper";

export interface IServerService {

    createServer(srv: IServerIni, userProps: IServerProps): Promise<IServerConfig>;

    runServer(id: string): Promise<ServerStatus>;

    stopServer(id: string): Promise<ServerStatus>;

    updateServer(srvId: string, srv: IServerConfig): Promise<IServerConfig>;

    getServer(srvId: string): Promise<IServerConfig>;

    getServerIds(): Promise<string[]>;
    
    getServers(): Promise<IServerConfig[]>;

    getTemplates(): Promise<string[]>;

    getJavaVersions(): Promise<string[]>;

    applyUserProperties(defaultProps: IServerProps, userProps?: IServerProps): IServerProps;

    isServerUp(srvId: string): Promise<boolean>;

    getServerStatus(srvId: string): Promise<ServerStatus>

}