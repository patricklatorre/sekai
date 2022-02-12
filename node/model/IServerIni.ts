type MemoryMb = 512 | 1024 | 2048 | 4096 | 6144;

export interface IServerIni {

  id?: string;
  name: string;

  templateId?: string;
  templateName: string;

  javaId?: string;
  javaName: string;

  usableRam: MemoryMb;

}