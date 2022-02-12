import {join} from 'path';

export function getBinPath() {
  return process.cwd();
}

export function getSettingsPath() {
  return join(getBinPath(), 'settings.ini');
}

export function getTemplatesPath() {
  return join(getBinPath(), 'templates');
}

export function getServersPath() {
  return join(getBinPath(), 'servers');
}

export function getJavaVersionsPath() {
  return join(getBinPath(), 'java');
}

export function getTemplatePath(templateId: string) {
  return join(getTemplatesPath(), templateId);
}

export function getServerPath(serverId: string) {
  return join(getServersPath(), serverId);
}

export function getJavaBinPath(version: string) {
  // TODO: Change to more OS agnostic form
  return join(getJavaVersionsPath(), version, 'bin', 'java.exe');
}

export function getServerJarPath(serverId: string) {
  return join(getServerPath(serverId), 'server.jar');
}

export function getIniPath(serverId: string) {
  return join(getServerPath(serverId), 'sekai.ini');
}

export function getEulaPath(serverId: string) {
  return join(getServerPath(serverId), 'eula.txt');
}

export function getPropertiesPath(serverId: string) {
  return join(getServerPath(serverId), 'server.properties');
}
