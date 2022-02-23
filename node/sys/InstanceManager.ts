import { IServerConfig } from "../model/IServerConfig";
import { IWrapper, ServerStatus } from "../model/IWrapper";
import Wrapper from "../wrapper/Wrapper";

class InstanceManager {

  private instanceMap = new Map<string, IWrapper>();

  async create(config: IServerConfig) {
    const wrapper = new Wrapper(config);

    if (config.ini.id !== undefined) {
      this.instanceMap.set(config.ini.id, wrapper);
    }
  }

  async getAll() {
    const instanceList: IWrapper[] = [];

    for (const [id, instance] of Object.entries(this.instanceMap)) {
      instanceList.push(instance);
    }
  }

  async get(id: string) {
    return this.instanceMap.get(id);
  }

  async destroy(id: string) {
    const instance = this.instanceMap.get(id);

    if (instance !== undefined) {
      await instance.stop();
      if (instance.status === ServerStatus.OFFLINE) {
        this.instanceMap.delete(id);
      }
    }
  }

}

export default InstanceManager;