import {IServer} from "../model/IServer";
import {IServerIni} from "../model/IServerIni";
import {IServerProps} from "../model/IServerProps";

export interface IRestClient {
    createServer(srv: IServerIni, userProps: IServerProps): Promise<IServer>;

    runServer(id: string): Promise<IServer>;

    isServerUp(srvId: string): Promise<boolean>;

    updateServer(srvId: string, srv: IServer): Promise<IServer>;

    getServer(srvId: string): Promise<IServer>;

    getServerIds(): Promise<string[]>;
    
    getServers(): Promise<IServer[]>;

    getTemplates(): Promise<string[]>;

    getJavaVersions(): Promise<string[]>;

}
