import { IMetadataStore } from "./IMetadataStore";

export interface IFileSys extends IMetadataStore {

  copyTemplate(srvId: string, templateName: string): Promise<void>;

  acceptEula(srvId: string): Promise<void>;

}