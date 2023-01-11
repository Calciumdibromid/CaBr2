import { invoke } from '@tauri-apps/api/tauri';
import { LogLevel } from '../logger';
import logWeb from './web.logger-impl';

export default (level: LogLevel, path: string, ...messages: any[]): void => {
  logWeb(level, path, ...messages);
  invoke('plugin:cabr2_logger|log', {
    level,
    path,
    messages,
  }).catch((err) => {
    console.error(err);
  });
};
