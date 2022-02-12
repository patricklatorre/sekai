import { IMetadataStore } from "./IMetadataStore";

export interface IFileSys extends IMetadataStore {

  copyTemplate(srvId: string, templateName: string): void;

  acceptEula(srvId: string): void;

}