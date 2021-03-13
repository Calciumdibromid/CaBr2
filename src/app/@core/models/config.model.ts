import { BehaviorSubject } from 'rxjs';

import Logger from '../utils/logger';

const logger = new Logger('config.model');

export class ConfigModel {
  private global: Global;

  constructor(global?: Global) {
    if (global) {
      this.global = global;
    } else {
      logger.debug('returning default config');
      this.global = { darkTheme: false, language: 'de_de' };
    }
  }

  get globalSection(): Global {
    return this.global;
  }

  static setConfig(config: ConfigModel): void {
    // this must be config.global because this is mostly a deserialized JSON from the backend
    configSubject.next(new ConfigModel(config.global));
  }

  setDarkMode(darkTheme: boolean): void {
    if (this.global.darkTheme !== darkTheme) {
      configSubject.next(new ConfigModel({ ...this.global, darkTheme }));
    }
  }

  setLanguage(language: string): void {
    if (this.global.language !== language) {
      configSubject.next(new ConfigModel({ ...this.global, language }));
    }
  }
}

export interface Global {
  readonly darkTheme: boolean;
  readonly language: string;
}

export const configSubject = new BehaviorSubject<ConfigModel>(new ConfigModel());
export const configObservable = configSubject.asObservable();
