import { IProperties } from "../model/IProperties";
import { IServer } from "../model/IServer";
import { IServerIni } from "../model/IServerIni";

export interface IFilesDao {

    createServer(srv: IServerIni, userProps: IProperties): Promise<IServer>;

    runServer(id: string): IServer;

    getServer(srvId: string): IServer;

    normalizeProperties(defaultProps: IProperties, userProps?: IProperties): IProperties;

}