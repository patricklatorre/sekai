import INI from 'ini';
import log from 'npmlog';
import {existsSync, writeFileSync, readFileSync} from 'fs';

import * as paths from './util/PathUtil';

let settings = {};

export function initialize() {
  const settingsPath    = paths.getSettingsPath();
  const settingsExists  = existsSync(settingsPath);

  try {

    if (!settingsExists) {

      const newSettings = {
        ipAddress: '',
        usePassword: false,
        password: '',
      };

      const content = INI.stringify(newSettings);
      writeFileSync(settingsPath, content, 'utf8');
      log.info('', `Generated settings.ini: ${settingsPath}`);
      settings = newSettings;

    } else {

      const content = readFileSync(settingsPath, 'utf8');
      const newSettings = INI.stringify(content);
      settings = newSettings;

    }

  } catch (err) {
    log.error('', ''+err); 
  }
  
}

export function getSettings() {
  return {...settings};
}
