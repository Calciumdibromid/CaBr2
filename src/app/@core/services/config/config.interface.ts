import { ConfigModel } from '../../models/config.model';
import { GHSSymbols } from '../../models/global.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export abstract class IConfigService {
  abstract getProgramVersion(): Observable<string>;

  abstract getConfig(): Observable<ConfigModel>;

  abstract saveConfig(config: ConfigModel): Observable<void>;

  abstract getHazardSymbols(): Observable<GHSSymbols>;

  abstract getPromptHtml(name: string): Observable<string>;
}
