import { IServerProps } from "../model/IServerProps";
import { IServer } from "../model/IServer";
import { IServerIni } from "../model/IServerIni";

export interface IServerService {

    createServer(srv: IServerIni, userProps: IServerProps): Promise<IServer>;

    runServer(id: string): Promise<IServer>;

    getServer(srvId: string): Promise<IServer>;

    getServerIds(): Promise<string[]>;
    
    getServers(): Promise<IServer[]>;

    applyUserProperties(defaultProps: IServerProps, userProps?: IServerProps): IServerProps;

}