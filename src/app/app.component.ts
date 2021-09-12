import { Component, HostBinding, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { first, switchMap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { translate } from '@ngneat/transloco';

import {
  configChangeObservable,
  configLoadObservable,
  ConfigModel,
  configObservable,
} from './@core/models/config.model';
import { AlertService } from './@core/services/alertsnackbar/altersnackbar.service';
import { ConsentComponent } from './components/consent/consent.component';
import { GlobalModel } from './@core/models/global.model';
import { IConfigService } from './@core/services/config/config.interface';
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

    private global: GlobalModel,
    private configService: IConfigService,
    private alertService: AlertService,
  ) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.configService
      .getConfig()
      .pipe(first())
      .subscribe(
        (newConfig) => ConfigModel.setLoadedConfig(newConfig),
        (err) => {
          logger.error('loading config failed:', err);
          this.alertService.error(translate('error.configLoad'));
        },
      );

    this.subscriptions.push(
      configChangeObservable.pipe(switchMap((config) => this.configService.saveConfig(config).pipe(first()))).subscribe(
        () => logger.info('config saved'),
        (err) => {
          logger.error('saving config failed:', err);
          this.alertService.error(translate('error.configSave'));
        },
      ),

      configObservable.subscribe((config) => {
        this.switchMode(config.globalSection.darkTheme);

        this.config = config;
      }),

      this.configService.getHazardSymbols().subscribe(
        (symbols) => this.global.setGHSSymbols(symbols),
        (err) => {
          logger.error('loading ghs-symbols failed:', err);
          this.alertService.error(translate('error.getHazardSymbols'));
        },
      ),
    );

    configLoadObservable.pipe(first()).subscribe((config) => {
      if (!config.globalSection.acceptedConsent) {
        this.dialog
          .open(ConsentComponent, {
            data: {
              duration: 10,
            },
            disableClose: true,
          })
          .afterClosed()
          .subscribe(() => {
            this.config.setAcceptedConsent(true);
            this.configService
              .saveConfig(this.config)
              .pipe(first())
              .subscribe(
                () => logger.info('config saved'),
                (err) => {
                  logger.error('saving config failed:', err);
                  this.alertService.error(translate('error.configSave'));
                },
              );
          });
      }
    });
  }

  @HostBinding('class')
  get themeMode(): string {
    return this.config?.globalSection.darkTheme ? 'theme-dark' : 'theme-light';
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
