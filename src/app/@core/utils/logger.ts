import { environment } from '../../../environments/environment';

export enum LogLevel {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

const logImplWeb = (level: LogLevel, path: string, ...messages: any[]) => {
  let fn;
  switch (level) {
    case LogLevel.TRACE:
    case LogLevel.DEBUG:
    case LogLevel.INFO:
      fn = console.log;
      break;

    case LogLevel.WARNING:
      fn = console.warn;
      break;

    case LogLevel.ERROR:
      fn = console.error;
      break;
  }

  fn(`[${level}]`, `[${path}]`, ...messages);
};

const logImplTauri = (() => {
  let cachedCalls: [string, any][] = [];
  let invoke = async (cmd: string, args: any): Promise<any> => {
    // defer actual logging until module finished loading
    cachedCalls.push([cmd, args]);
  };
  import('@tauri-apps/api/tauri').then((tauri) => {
    invoke = tauri.invoke;
    cachedCalls.forEach(([cmd, args]) => {
      invoke(cmd, args);
    });
  });

  return (level: LogLevel, path: string, ...messages: any[]) => {
    invoke('plugin:cabr2_logger|log', {
      level,
      path,
      messages,
    }).catch((err) => {
      console.error(err);
    });
  };
})();

const log = (() => {
  if (environment.web) {
    return logImplWeb;
  } else {
    return logImplTauri;
  }
})();

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
