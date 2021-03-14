import { Component, HostBinding, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { first, skip, switchMap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { ConfigModel, configObservable } from './@core/models/config.model';
import { I18nService, LocalizedStrings } from './@core/services/i18n/i18n.service';
import { name, version } from '../../package.json';
import { AlertService } from './@core/services/alertsnackbar/altersnackbar.service';
import { ConfigService } from './@core/services/config/config.service';
import { ConsentComponent } from './consent/consent.component';
import { GlobalModel } from './@core/models/global.model';
import Logger from './@core/utils/logger';

const logger = new Logger('main');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  name = name;
  version = version;
  strings!: LocalizedStrings;

  private config!: ConfigModel;
  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private dialog: MatDialog,

    private global: GlobalModel,
    private configService: ConfigService,
    private alertService: AlertService,
    private i18nService: I18nService,
  ) {
    this.global.localizedStringsObservable.subscribe((strings) => (this.strings = strings));
    this.configService
      .getPromptHtml('gettingStarted')
      .pipe(first())
      .subscribe(
        (str) => logger.debug('html: [', str, ']'),
        (err) => logger.error(err),
      );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.configService
      .getConfig()
      .pipe(first())
      .subscribe(
        (newConfig) => ConfigModel.setConfig(newConfig),
        (err) => {
          logger.error('loading config failed:', err);
          this.alertService.error(this.strings.error.configLoad);
        },
      );

    this.subscriptions.push(
      // skip initial config and first load
      configObservable
        .pipe(
          skip(2),
          switchMap((config) => this.configService.saveConfig(config).pipe(first())),
        )
        .subscribe(
          () => logger.info('config saved'),
          (err) => {
            logger.error('saving config failed:', err);
            this.alertService.error(this.strings.error.configSave);
          },
        ),

      configObservable.subscribe((config) => {
        // config is undefined before first call of this function
        if (!(this.config?.globalSection.language === config.globalSection.language)) {
          this.i18nService
            .getLocalizedStrings(config.globalSection.language)
            .pipe(first())
            .subscribe(
              (strings) => this.global.localizedStringsSubject.next(strings),
              (err) => {
                logger.error(err);
                this.alertService.error(this.strings.error.localeLoading);
              },
            );
        }

        this.switchMode(config.globalSection.darkTheme);

        this.config = config;
      }),

      this.configService.getHazardSymbols().subscribe(
        (symbols) => this.global.setGHSSymbols(symbols),
        (err) => {
          logger.error('loading ghs-symbols failed:', err);
          this.alertService.error(this.strings.error.getHazardSymbols);
        },
      ),
    );

    // skip initial config only first load is needed
    configObservable.pipe(skip(1), first()).subscribe((config) => {
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
                  this.alertService.error(this.strings.error.configSave);
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
