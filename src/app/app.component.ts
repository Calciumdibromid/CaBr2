import { Component, HostBinding, Inject, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { I18nService, LocalizedStrings } from './@core/services/i18n/i18n.service';
import { name, version } from '../../package.json';
import { AlertService } from './@core/services/alertsnackbar/altersnackbar.service';
import { ConfigModel } from './@core/models/config.model';
import { ConfigService } from './@core/services/config/config.service';
import { GlobalModel } from './@core/models/global.model';
import Logger from './@core/utils/logger';

const logger = new Logger('main');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  name = name;
  version = version;
  strings!: LocalizedStrings;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,

    private config: ConfigModel,
    private global: GlobalModel,
    private configService: ConfigService,
    private alertService: AlertService,
    private i18nService: I18nService,
  ) {
    this.global.localizedStringsObservable.subscribe((strings) => this.strings = strings);
    this.i18nService.getAvailableLanguages().subscribe(
      (languages) => logger.debug('available localizations:', languages),
      (err) => logger.error('getting available localizations failed:', err),
    );
  }

  ngOnInit(): void {
    this.configService.getConfig().subscribe(
      (config) => {
        this.config.setConfig(config);
        this.i18nService.getLocalizedStrings(config.global.language).subscribe(
          (strings) => this.global.localizedStringsSubject.next(strings),
          (err) => {
            logger.error(err);
            this.alertService.error(this.strings.error.localeLoading);
          }
        );
        this.switchMode(this.config.global.darkTheme);
      },
      (err) => {
        logger.error('loading config failed:', err);
        this.alertService.error(this.strings.error.configLoad);
      },
    );

    this.configService.getHazardSymbols().subscribe(
      (symbols) => this.global.setGHSSymbols(symbols),
      (err) => {
        logger.error('loading ghs-symbols failed:', err);
        this.alertService.error(this.strings.error.getHazardSymbols);
      },
    );
  }

  @HostBinding('class')
  get themeMode(): string {
    return this.config.global.darkTheme ? 'theme-dark' : 'theme-light';
  }

  switchMode(isDarkMode: boolean): void {
    const hostClass = isDarkMode ? 'theme-dark' : 'theme-light';
    this.config.global.darkTheme = isDarkMode;
    this.renderer.setAttribute(this.document.body, 'class', hostClass);
  }

  switchModeSink(isDarkMode: boolean): void {
    this.switchMode(isDarkMode);
    this.configService.saveConfig(this.config).subscribe(
      () => logger.info('config saved'),
      (err) => {
        logger.error('saving config failed:', err);
        this.alertService.error(this.strings.error.configSave);
      },
    );
  }
}
