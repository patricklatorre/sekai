import {IServerConfig} from "../model/IServerConfig";
import {IServerIni} from "../model/IServerIni";
import {IServerProps} from "../model/IServerProps";
import { IPData } from "../model/ISettings";
import ServerStatus from "../model/ServerStatus";

export interface IRestClient {
    createServer(srv: IServerIni, userProps: IServerProps): Promise<IServerConfig>;

    runServer(id: string): Promise<ServerStatus>;

    stopServer(id: string): Promise<ServerStatus>;

    isServerUp(srvId: string): Promise<boolean>;

    getServerStatus(srvId: string): Promise<ServerStatus>;

    updateServer(srvId: string, srv: IServerConfig): Promise<IServerConfig>;

    getServer(srvId: string): Promise<IServerConfig>;

    getServerIds(): Promise<string[]>;
    
    getServers(): Promise<IServerConfig[]>;

    getTemplates(): Promise<string[]>;

    getJavaVersions(): Promise<string[]>;

    getIpData(): Promise<IPData>;
}
