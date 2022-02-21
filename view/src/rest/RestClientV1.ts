import { IRestClient } from "./IRestClient";
import { IServer } from "../model/IServer";
import { IServerIni } from "../model/IServerIni";
import { IServerProps } from "../model/IServerProps";

class RestClientV1 implements IRestClient {

  async createServer(srv: IServerIni, userProps: IServerProps): Promise<IServer> {
    const body: IServer = {
      ini   : {...srv},
      props : {...userProps},
    };

    const res = await fetch('http://localhost:5420/api/server', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result: IServer = await res.json();

    return result;
  }

  async isServerUp(srvId: string): Promise<boolean> {
    const res = await fetch(`http://localhost:5420/api/ping/${srvId}`);
    const srv = await res.json();
    return srv;
  }

  async updateServer(srvId: string, srv: IServer): Promise<IServer> {
    const body: IServer = {...srv};

    const res = await fetch(`http://localhost:5420/api/server/${srvId}`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result: IServer = await res.json();

    return result;
  }

  async getServer(srvId: string): Promise<IServer> {
    const res = await fetch(`http://localhost:5420/api/server/${srvId}`);
    const srv = await res.json();
    return srv;
  }

  async getServerIds(): Promise<string[]> {
    const res = await fetch(`http://localhost:5420/api/serverid`);
    const ids = await res.json();
    return ids;
  }

  async getServers(): Promise<IServer[]> {
    const res = await fetch(`http://localhost:5420/api/server`);
    const srvs = await res.json();
    return srvs;
  }

  async getTemplates(): Promise<string[]> {
    const res = await fetch('http://localhost:5420/api/template');
    const templates = await res.json();
    return templates;
  }
  
  async getJavaVersions(): Promise<string[]> {
    const res = await fetch('http://localhost:5420/api/java');
    const javaVersions = await res.json();
    return javaVersions;
  }

  async runServer(id: string): Promise<IServer> {
    const res = await fetch(`http://localhost:5420/api/run/${id}`);
    const srv = await res.json();
    return srv;
  }
}

export default RestClientV1;