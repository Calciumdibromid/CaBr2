import { invoke } from 'tauri/api/tauri';

export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
}

export function log(level: LogLevel, msg: string | number | unknown): void {
    invoke({
        cmd: 'log',
        level: level,
        message: msg,
    });
}

export default class logger {
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
