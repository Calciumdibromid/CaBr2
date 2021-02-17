import { invoke } from 'tauri/api/tauri';

export enum LogLevel {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

const log = (level: LogLevel, ...messages: unknown[]): void => {
  invoke({
    cmd: 'log',
    level,
    messages,
  });
};

export { log };

export default class logger {
  static trace(...messages: unknown[]): void {
    log(LogLevel.TRACE, ...messages);
  }

  static debug(...messages: unknown[]): void {
    log(LogLevel.DEBUG, ...messages);
  }

  static info(...messages: unknown[]): void {
    log(LogLevel.INFO, ...messages);
  }

  static warning(...messages: unknown[]): void {
    log(LogLevel.WARNING, ...messages);
  }

  static error(...messages: unknown[]): void {
    log(LogLevel.ERROR, ...messages);
  }
}
