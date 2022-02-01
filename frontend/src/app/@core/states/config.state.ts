import { Action, State, StateContext } from '@ngxs/store';
import { translate, TranslocoService } from '@ngneat/transloco';
import { first } from 'rxjs';
import { Injectable } from '@angular/core';

import { AlertService } from '../services/alertsnackbar/alertsnackbar.service';
import { Config } from '../interfaces/config.interface';
import { environment } from 'src/environments/environment';
import { IConfigService } from '../services/config/config.interface';
import Logger from '../utils/logger';

const logger = new Logger('configstate');

export class LoadConfig {
  static readonly type = '[Config] load config';
}

export class SaveConfig {
  static readonly type = '[Config] save config';

  constructor(public config: Config) {}
}

export class ToggleDarkTheme {
  static readonly type = '[Config] toggle darktheme';

  constructor(public darkTheme: boolean) {}
}

export class ChangeLanguage {
  static readonly type = '[Config] change language';

  constructor(public languageKey: string) {}
}

export class AcceptConsent {
  static readonly type = '[Config] accept consent';
}

@State<Config>({
  name: 'config',
  defaults: {
    darkTheme: false,
    language: 'de_de',
    acceptedConsent: false,
  },
})
@Injectable()
export class ConfigState {
  constructor(
    private configService: IConfigService,
    private alertService: AlertService,
    private translocoService: TranslocoService,
  ) {}

  @Action(LoadConfig)
  loadConfig(context: StateContext<Config>): void {
    if (environment.web) {
      this.translocoService.setActiveLang(context.getState().language);
      return;
    }

    const state = context.getState();
    this.configService
      .loadConfig()
      .pipe(first())
      .subscribe({
        next: (newConfig) => {
          console.log(newConfig);
          context.setState({
            ...state,
            ...newConfig,
          });
        },
        error: (err) => {
          logger.error('loading config failed:', err);
          this.alertService.error(translate('error.configLoad'));
        },
      });
  }

  @Action(ToggleDarkTheme)
  toggleDarkTheme(context: StateContext<Config>, action: ToggleDarkTheme): void {
    context.patchState({
      darkTheme: action.darkTheme,
    });

    this.saveConfig(context.getState());
  }

  @Action(ChangeLanguage)
  changeLanguage(context: StateContext<Config>, action: ChangeLanguage): void {
    context.patchState({
      language: action.languageKey,
    });
    this.translocoService.setActiveLang(action.languageKey);

    this.saveConfig(context.getState());
  }

  @Action(AcceptConsent)
  toggleAcceptConsent(context: StateContext<Config>): void {
    context.patchState({
      acceptedConsent: true,
    });

    this.saveConfig(context.getState());
  }

  private saveConfig(config: Config): void {
    if (environment.web) {
      logger.info('Web target! Nothing todo');
      return;
    }

    this.configService
      .saveConfig(config)
      .pipe(first())
      .subscribe({
        next: () => logger.info('config saved'),
        error: (err) => {
          logger.error('saving config failed', err);
          this.alertService.error(translate('error.configSave'));
        },
      });
  }
}
