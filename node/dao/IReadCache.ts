import { AbstractIterator } from "abstract-leveldown";
import EncodingDown from "encoding-down"
import { LevelUp } from "levelup";
import MemDown from "memdown";
import { IServer } from "../model/IServer";

/* In-memory db containing all IServer data. */
const readCache = LevelUp(
  EncodingDown<string, IServer>(MemDown(), { valueEncoding: 'json' })
);


export default readCache;