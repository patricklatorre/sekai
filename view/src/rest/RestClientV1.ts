import { IRestClient } from "./IRestClient";
import { IServerConfig } from "../model/IServerConfig";
import { IServerIni } from "../model/IServerIni";
import { IServerProps } from "../model/IServerProps";
import { IPData } from "../model/ISettings";
import ServerStatus from "../model/ServerStatus";

class RestClientV1 implements IRestClient {

  private host = 'http://localhost:5420';

  async createServer(srv: IServerIni, userProps: IServerProps): Promise<IServerConfig> {
    const body: IServerConfig = {
      ini   : {...srv},
      props : {...userProps},
    };

    const res = await fetch(this.host + '/api/server', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result: IServerConfig = await res.json();

    return result;
  }

  async isServerUp(srvId: string): Promise<boolean> {
    const res = await fetch(this.host + `/api/ping/${srvId}`);
    const srv = await res.json();
    return srv;
  }

  async getServerStatus(srvId: string): Promise<ServerStatus> {
    const res = await fetch(this.host + `/api/status/${srvId}`);
    const status = await res.json();
    return status;
  }

  async updateServer(srvId: string, srv: IServerConfig): Promise<IServerConfig> {
    const body: IServerConfig = {...srv};

    const res = await fetch(this.host + `/api/server/${srvId}`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result: IServerConfig = await res.json();

    return result;
  }

  async getServer(srvId: string): Promise<IServerConfig> {
    const res = await fetch(this.host + `/api/server/${srvId}`);
    const srv = await res.json();
    return srv;
  }

  async getServerIds(): Promise<string[]> {
    const res = await fetch(this.host + `/api/serverid`);
    const ids = await res.json();
    return ids;
  }

  async getServers(): Promise<IServerConfig[]> {
    const res = await fetch(this.host + `/api/server`);
    const srvs = await res.json();
    return srvs;
  }

  async getTemplates(): Promise<string[]> {
    const res = await fetch(this.host + '/api/template');
    const templates = await res.json();
    return templates;
  }
  
  async getJavaVersions(): Promise<string[]> {
    const res = await fetch(this.host + '/api/java');
    const javaVersions = await res.json();
    return javaVersions;
  }

  async runServer(id: string): Promise<ServerStatus> {
    const res = await fetch(this.host + `/api/run/${id}`);
    const status = await res.json();
    return status;
  }

  async stopServer(id: string): Promise<ServerStatus> {
    const res = await fetch(this.host + `/api/stop/${id}`);
    const status = await res.json();
    return status;
  }
  
  async getIpData(): Promise<IPData> {
    const res = await fetch(this.host + `/api/settings/ip`);
    const ips = <IPData> await res.json();
    return ips;
  }
}

export default RestClientV1;