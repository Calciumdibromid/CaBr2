import { invoke } from 'tauri/api/tauri';

export enum LogLevel {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

/**
 * @deprecated
 * Do not use this function directly, use the logger class that is provided in this file.
 * Access to this function will be removed in a future version.
 */
const log = (level: LogLevel, ...messages: any[]): void => {
  invoke({
    cmd: 'log',
    level,
    messages,
  });
};

export { log };

/**
 * This class provides methods that call the logging functions in the backend.
 * It is supposed to be used if you want to log something into the log file,
 * for development purposes use the methods of `console.*`.
 */
export default class logger {

  /**
   * Logs all arguments space separated with the level `TRACE`.
   */
  static trace(...messages: any[]): void {
    log(LogLevel.TRACE, ...messages);
  }

  /**
   * Logs all arguments space separated with the level `DEBUG`.
   */
  static debug(...messages: any[]): void {
    log(LogLevel.DEBUG, ...messages);
  }

  /**
   * Logs all arguments space separated with the level `INFO`.
   */
  static info(...messages: any[]): void {
    log(LogLevel.INFO, ...messages);
  }

  /**
   * Logs all arguments space separated with the level `WARNING`.
   */
  static warning(...messages: any[]): void {
    log(LogLevel.WARNING, ...messages);
  }

  /**
   * Logs all arguments space separated with the level `ERROR`.
   */
  static error(...messages: any[]): void {
    log(LogLevel.ERROR, ...messages);
  }
}
