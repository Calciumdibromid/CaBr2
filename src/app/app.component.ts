import { Component, HostBinding, Inject, OnInit, Renderer2 } from '@angular/core';
import { name, version } from '../../package.json';
import { ConfigModel } from './@core/models/config.model';
import { ConfigService } from './@core/services/config/config.service';
import { DOCUMENT } from '@angular/common';
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

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private config: ConfigModel,
    private global: GlobalModel,
    private configService: ConfigService,
  ) {
  }

  ngOnInit(): void {
    this.configService.getConfig().subscribe(
      (config) => {
        this.config.setConfig(config);
        this.switchMode(this.config.global.darkTheme);
      },
      (err) => logger.error(err),
    );

    this.configService.getHazardSymbols().subscribe(
      (symbols) => this.global.setGHSSymbols(symbols),
      (err) => logger.error(err),
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
      (err) => logger.error(err),
    );
  }
}
