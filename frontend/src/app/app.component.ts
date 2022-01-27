import { Component, HostBinding, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { first, switchMap } from 'rxjs/operators';
import { translate, TranslocoService } from '@ngneat/transloco';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';

import {
  configChangeObservable,
  configLoadObservable,
  ConfigModel,
  configObservable,
} from './@core/models/config.model';
import { AlertService } from './@core/services/alertsnackbar/altersnackbar.service';
import { ConsentComponent } from './components/consent/consent.component';
import { IConfigService } from './@core/services/config/config.interface';
import { LoadGHSSymbols } from './@core/states/ghs-symbols.state';
import Logger from './@core/utils/logger';
import packageInfo from '../../package.json';

const logger = new Logger('main');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  name = packageInfo.name;

  version = packageInfo.version;

  private config!: ConfigModel;

  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private dialog: MatDialog,

    private configService: IConfigService,
    private alertService: AlertService,
    private translocoService: TranslocoService,
    private store: Store,
  ) {}

  @HostBinding('class')
  get themeMode(): string {
    return this.config?.globalSection.darkTheme ? 'theme-dark' : 'theme-light';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.configService
      .getConfig()
      .pipe(first())
      .subscribe({
        next: (newConfig) => ConfigModel.setLoadedConfig(newConfig),
        error: (err) => {
          logger.error('loading config failed:', err);
          this.alertService.error(translate('error.configLoad'));
        },
      });

    this.subscriptions.push(
      configChangeObservable
        .pipe(switchMap((config) => this.configService.saveConfig(config).pipe(first())))
        .subscribe({
          next: () => logger.info('config saved'),
          error: (err) => {
            logger.error('saving config failed:', err);
            this.alertService.error(translate('error.configSave'));
          },
        }),

      configObservable.subscribe((config) => {
        // config is undefined before first call of this function
        if (!(this.config?.globalSection.language === config.globalSection.language)) {
          this.translocoService.setActiveLang(config.globalSection.language);
        }

        this.switchMode(config.globalSection.darkTheme);

        this.config = config;
      }),
    );

    this.store.dispatch(new LoadGHSSymbols());

    configLoadObservable.pipe(first()).subscribe((config) => {
      if (!config.globalSection.acceptedConsent) {
        this.dialog
          .open(ConsentComponent, {
            data: {
              duration: 5,
            },
            disableClose: true,
          })
          .afterClosed()
          .subscribe(() => {
            this.config.setAcceptedConsent(true);
            this.configService
              .saveConfig(this.config)
              .pipe(first())
              .subscribe({
                next: () => logger.info('config saved'),
                error: (err) => {
                  logger.error('saving config failed:', err);
                  this.alertService.error(translate('error.configSave'));
                },
              });
          });
      }
    });
  }

  switchMode(isDarkMode: boolean): void {
    const hostClass = isDarkMode ? 'theme-dark' : 'theme-light';
    this.renderer.setAttribute(this.document.body, 'class', hostClass);
  }

  switchModeSink(isDarkMode: boolean): void {
    this.switchMode(isDarkMode);
    this.config.setDarkMode(isDarkMode);
  }
}
