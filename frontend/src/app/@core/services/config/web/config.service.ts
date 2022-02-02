import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

import * as wasm from 'cabr2_wasm';
import { GHSSymbols } from 'src/app/@core/models/substances.model';

import { Config } from '../../../interfaces/config.interface';
import { IConfigService } from '../config.interface';

@Injectable()
export class ConfigWebService implements IConfigService {
  getProgramVersion(): Observable<string> {
    return of(wasm.get_program_version());
  }

  loadConfig(): Observable<Config> {
    throw Error('Loadconfig is not required for web');
  }

  saveConfig(_: any): Observable<void> {
    throw Error('Saveconfig is not required for web');
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
