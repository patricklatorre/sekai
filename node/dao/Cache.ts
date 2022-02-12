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

  listJavaNames(): string[] {
    throw new Error("Method not implemented.");
  }

  listServerIds(): string[] {
    throw new Error("Method not implemented.");
  }

  listTemplateNames(): string[] {
    throw new Error("Method not implemented.");
  }

  getServerMetadata(srvId: string): IServer {
    throw new Error("Method not implemented.");
  }

  saveServerMetadata(srvId: string, srv: IServer): IServer {
    throw new Error("Method not implemented.");
  }

  getIni(srvId: string): IServerIni {
    throw new Error("Method not implemented.");
  }

  saveIni(srvId: string, ini: IServerIni): void {
    throw new Error("Method not implemented.");
  }

  getProps(srvId: string): IServerProps {
    throw new Error("Method not implemented.");
  }

  saveProps(srvId: string, props: IServerProps): void {
    throw new Error("Method not implemented.");
  }

}

export default FileSysCache;