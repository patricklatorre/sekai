import INI from 'ini';
import log from 'npmlog';
import {existsSync, writeFileSync, readFileSync} from 'fs';

import * as paths from './util/PathUtil';

export interface ISettings {
  ipAddress: string;
  vpnIpAddress: string;
  detachServers: boolean;
  usePassword: boolean;
  password: string;
}

export interface IPData {
  local: string;
  vpn: string;
};

let settings: ISettings = {
  ipAddress: '',
  vpnIpAddress: '',
  detachServers: false,
  usePassword: false,
  password: '',
};

export function initialize() {
  const settingsPath    = paths.getSettingsPath();
  const settingsExists  = existsSync(settingsPath);

  try {

    if (!settingsExists) {

      const newSetting: ISettings = {
        ipAddress: '',
        vpnIpAddress: '',
        detachServers: false,
        usePassword: false,
        password: '',
      };

      const content = INI.stringify(newSetting);
      writeFileSync(settingsPath, content, 'utf8');
      log.info('', `Generated settings.ini: ${settingsPath}`);
      settings = newSetting;

    } else {

      const content = readFileSync(settingsPath, 'utf8');
      const newSettings = <ISettings> INI.parse(content);
      settings = newSettings;

    }

  } catch (err) {
    log.error('', ''+err); 
  }
  
}

export function getSettings() {
  return settings;
}
