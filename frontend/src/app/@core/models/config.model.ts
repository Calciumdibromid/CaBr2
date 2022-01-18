import { filter, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import Logger from '../utils/logger';

const logger = new Logger('config.model');

enum ConfigState {
  INITIAL,
  LOADED,
  CHANGED,
}

const setConfig = (config: ConfigModel): void => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  configSubject.next([config, ConfigState.CHANGED]);
};

export class ConfigModel {
  private global: Global;

  constructor(global?: Global) {
    if (global) {
      this.global = global;
    } else {
      logger.debug('returning default config');
      this.global = { darkTheme: false, language: 'de_de', acceptedConsent: false };
    }
  }

  get globalSection(): Global {
    return this.global;
  }

  static setLoadedConfig(config: ConfigModel): void {
    // this must be config.global because this is mostly a deserialized JSON from the backend
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    configSubject.next([new ConfigModel(config.global), ConfigState.LOADED]);
  }

  static setConfig(config: ConfigModel): void {
    // this must be config.global because this is mostly a deserialized JSON from the backend
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    configSubject.next([new ConfigModel(config.global), ConfigState.CHANGED]);
  }

  setDarkMode(darkTheme: boolean): void {
    if (this.global.darkTheme !== darkTheme) {
      setConfig(new ConfigModel({ ...this.global, darkTheme }));
    }
  }

  setLanguage(language: string): void {
    if (this.global.language !== language) {
      setConfig(new ConfigModel({ ...this.global, language }));
    }
  }

  setAcceptedConsent(acceptedConsent: boolean): void {
    if (this.global.acceptedConsent !== acceptedConsent) {
      setConfig(new ConfigModel({ ...this.global, acceptedConsent }));
    }
  }
}

export interface Global {
  readonly darkTheme: boolean;
  readonly language: string;
  readonly acceptedConsent: boolean;
}

const configSubject = new BehaviorSubject<[ConfigModel, ConfigState]>([new ConfigModel(), ConfigState.INITIAL]);
const privConfigObservable = configSubject.asObservable();
/** all config changes */
export const configObservable = privConfigObservable.pipe(map(([config, _]) => config));
/** only if config is loaded from storage */
export const configLoadObservable = privConfigObservable.pipe(
  filter(([_, state]) => state === ConfigState.LOADED),
  map(([config, _]) => config),
);
/** only if config was changed but not loaded */
export const configChangeObservable = privConfigObservable.pipe(
  filter(([_, state]) => state === ConfigState.CHANGED),
  map(([config, _]) => config),
);
