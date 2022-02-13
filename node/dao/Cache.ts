import { AbstractIterator } from "abstract-leveldown";
import EncodingDown from "encoding-down"
import { LevelUp } from "levelup";
import MemDown from "memdown";
import { IServer } from "../model/IServer";
import { IServerIni } from "../model/IServerIni";
import { IServerProps } from "../model/IServerProps";
import { IMetadataStore } from "./IMetadataStore";

class FileSysCache implements IMetadataStore {

  /* In-memory db containing all IServer data. */
  db = LevelUp(
    EncodingDown<string, IServer>(MemDown(), { valueEncoding: 'json' })
  );


  listJavaNames(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  
  
  listServerIds(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  
  
  listTemplateNames(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  
  
  getServerMetadata(srvId: string): Promise<IServer> {
    throw new Error("Method not implemented.");
  }
  
  
  saveServerMetadata(srvId: string, srv: IServer): Promise<void> {
    throw new Error("Method not implemented.");
  }
  
  
  getIni(srvId: string): Promise<IServerIni> {
    throw new Error("Method not implemented.");
  }
  
  
  saveIni(srvId: string, ini: IServerIni): Promise<void> {
    throw new Error("Method not implemented.");
  }
  
  
  getProps(srvId: string): Promise<IServerProps> {
    throw new Error("Method not implemented.");
  }
  
  
  saveProps(srvId: string, props: IServerProps): Promise<void> {
    throw new Error("Method not implemented.");
  }

}

export default FileSysCache;