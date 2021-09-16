import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

import * as wasm from 'cabr2_wasm';
import { ConfigModel } from 'src/app/@core/models/config.model';
import { GHSSymbols } from 'src/app/@core/models/global.model';

import { IConfigService } from '../config.interface';

@Injectable()
export class ConfigWebService implements IConfigService {
  getProgramVersion(): Observable<string> {
    return of(wasm.get_program_version());
  }

  getConfig(): Observable<ConfigModel> {
    const config = localStorage.getItem('config');
    if (config) {
      return of(new ConfigModel(JSON.parse(config).global));
    } else {
      return of(new ConfigModel());
    }
  }

  saveConfig(config: ConfigModel): Observable<void> {
    return of(localStorage.setItem('config', JSON.stringify(config)));
  }

  getHazardSymbols(): Observable<GHSSymbols> {
    return of(
      new Map<string, string>([
        ['ghs01', 'ghs_symbols/ghs01.png'],
        ['ghs02', 'ghs_symbols/ghs02.png'],
        ['ghs03', 'ghs_symbols/ghs03.png'],
        ['ghs04', 'ghs_symbols/ghs04.png'],
        ['ghs05', 'ghs_symbols/ghs05.png'],
        ['ghs06', 'ghs_symbols/ghs06.png'],
        ['ghs07', 'ghs_symbols/ghs07.png'],
        ['ghs08', 'ghs_symbols/ghs08.png'],
        ['ghs09', 'ghs_symbols/ghs09.png'],
      ]),
    );
  }
}
