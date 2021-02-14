import { invoke } from 'tauri/api/tauri';

export enum LogLevel {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

const log = (level: LogLevel, msg: unknown): void  => {
  invoke({
    cmd: 'log',
    level,
    message: msg,
  });
};

export {log};

export default class logger {
  static trace(msg: unknown): void {
    log(LogLevel.TRACE, msg);
  }

  static debug(msg: unknown): void {
    log(LogLevel.DEBUG, msg);
  }

  static info(msg: unknown): void {
    log(LogLevel.INFO, msg);
  }

  static warning(msg: unknown): void {
    log(LogLevel.WARNING, msg);
  }

  static error(msg: unknown): void {
    log(LogLevel.ERROR, msg);
  }
}
