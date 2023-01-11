import { LogLevel } from '../logger';

export default (level: LogLevel, path: string, ...messages: any[]): void => {
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
