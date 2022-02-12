import { IServerProps } from "../model/IServerProps";
import { IServer } from "../model/IServer";
import { IServerIni } from "../model/IServerIni";

export interface IServerService {

    createServer(srv: IServerIni, userProps: IServerProps): Promise<IServer>;

    runServer(id: string): IServer;

    getServer(srvId: string): IServer;

    normalizeProperties(defaultProps: IServerProps, userProps?: IServerProps): IServerProps;

}