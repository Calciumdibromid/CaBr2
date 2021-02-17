import { Injectable } from '@angular/core';
import { LogLevel } from '../utils/logger';

@Injectable()
export class ConfigModel {
  global: Global = {
    darkTheme: false,
  };

  // config should be read before saving so this should be ok
  logging?: Logging;

  setConfig(newConfig: ConfigModel) {
    this.global = newConfig.global;
    this.logging = newConfig.logging;
  }
}

export interface Global {
  darkTheme: boolean;
}

export interface Logging {
  all: LogLevel;
  cabr2: LogLevel;
  rustls: LogLevel;
  ureq: LogLevel;
}
