import { Component, HostBinding, Inject, OnInit, Renderer2 } from '@angular/core';
import { name, version } from '../../package.json';
import { AlertService } from './@core/services/alertsnackbar/altersnackbar.service';
import { ConfigModel } from './@core/models/config.model';
import { ConfigService } from './@core/services/config/config.service';
import { DOCUMENT } from '@angular/common';
import { GlobalModel } from './@core/models/global.model';
import { i18n } from './@core/services/i18n/i18n.service';
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
  strings = i18n.getStrings('de');

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private config: ConfigModel,
    private global: GlobalModel,
    private configService: ConfigService,
    private alertService: AlertService,
  ) {
  }

  ngOnInit(): void {
    this.configService.getConfig().subscribe(
      (config) => {
        this.config.setConfig(config);
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
