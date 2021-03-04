import { invoke } from 'tauri/api/tauri';

export enum LogLevel {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

const log = (level: LogLevel, path: string, ...messages: any[]): void => {
  invoke({
    cmd: 'log',
    level,
    path,
    messages,
  });
};

/**
 * This class provides methods that call the logging functions in the backend.
 * It is supposed to be used if you want to log something into the log file,
 * for development purposes use the methods of `console.*`.
 */
export default class Logger {

  path: string;

  /**
   * Creates new logger instance for a specified path or purpose.
   *
   * @param path filepath or other identifier to find source of log.
   */
  constructor(path: string) {
    this.path = path;
  }

  /**
   * Logs all arguments space separated with the level `TRACE`.
   */
  trace(...messages: any[]): void {
    log(LogLevel.TRACE, this.path, ...messages);
  }

  /**
   * Logs all arguments space separated with the level `DEBUG`.
   */
  debug(...messages: any[]): void {
    log(LogLevel.DEBUG, this.path, ...messages);
  }

  /**
   * Logs all arguments space separated with the level `INFO`.
   */
  info(...messages: any[]): void {
    log(LogLevel.INFO, this.path, ...messages);
  }

  /**
   * Logs all arguments space separated with the level `WARNING`.
   */
  warning(...messages: any[]): void {
    log(LogLevel.WARNING, this.path, ...messages);
  }

  /**
   * Logs all arguments space separated with the level `ERROR`.
   */
  error(...messages: any[]): void {
    log(LogLevel.ERROR, this.path, ...messages);
  }
}
