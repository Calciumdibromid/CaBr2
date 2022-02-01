import { DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Config } from '../../interfaces/config.interface';
import { GHSSymbols } from '../../models/substances.model';
import { IConfigService } from './config.interface';
import { INativeService } from '../native/native.interface';

@Injectable()
export class ConfigService implements IConfigService {
  constructor(private nativeService: INativeService, private sanitizer: DomSanitizer) {}

  getProgramVersion(): Observable<string> {
    return this.nativeService.promisified('plugin:cabr2_config|get_program_version');
  }

  loadConfig(): Observable<Config> {
    return this.nativeService.promisified('plugin:cabr2_config|get_config').pipe(
      map<any, Config>((config) => ({
        darkTheme: config.global.darkTheme,
        language: config.global.language,
        acceptedConsent: config.global.acceptedConsent,
      })),
    );
  }

  saveConfig(config: Config): Observable<void> {
    return this.nativeService.promisified('plugin:cabr2_config|save_config', {
      config: {
        global: config,
      },
    });
  }

  getHazardSymbols(): Observable<GHSSymbols> {
    return this.nativeService.promisified<GHSSymbols>('plugin:cabr2_config|get_hazard_symbols').pipe(
      map((symbols) => {
        const newSymbols = new Map();

        // symbols is just an object
        new Map(Object.entries(symbols)).forEach((s, k) =>
          newSymbols.set(k, this.sanitizer.bypassSecurityTrustResourceUrl(s)),
        );

        return newSymbols;
      }),
    );
  }
}
