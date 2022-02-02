import { Injectable } from '@angular/core';

import { Config } from '../../interfaces/config.interface';
import { GHSSymbols } from '../../models/substances.model';
import { Observable } from 'rxjs';

@Injectable()
export abstract class IConfigService {
  abstract getProgramVersion(): Observable<string>;

  abstract loadConfig(): Observable<Config>;

  abstract saveConfig(config: Config): Observable<void>;

  abstract getHazardSymbols(): Observable<GHSSymbols>;
}
