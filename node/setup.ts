import log from 'npmlog';
import fs from 'fs-extra';
import INI from 'ini';
import * as paths from './util/PathUtil';
import * as settings from './settings';

function setup() {
  const serverDir     = paths.getServersPath();
  const templateDir   = paths.getTemplatesPath();
  const javaDir       = paths.getJavaVersionsPath();
  const settingsPath  = paths.getSettingsPath();

  const serverDirExists   = fs.existsSync(serverDir);
  const templateDirExists = fs.existsSync(templateDir);
  const javaDirExists     = fs.existsSync(javaDir);

  try {
    if (!serverDirExists) {
      fs.mkdirSync(serverDir);
      log.info('', `Created servers folder: ${serverDir}`);
    }
  } catch (err) {
    log.error('', ''+err); 
  }

  try {
    if (!templateDirExists) {
      fs.mkdirSync(templateDir);
      log.info('', `Created templates folder: ${templateDir}`);
    }
  } catch (err) {
    log.error('', ''+err); 
  }

  try {
    if (!javaDirExists) {
      fs.mkdirSync(javaDir);
      log.info('', `Created java folder: ${javaDir}`);
    }
  } catch (err) {
    log.error('', ''+err); 
  }

  settings.initialize();
}

export default setup;