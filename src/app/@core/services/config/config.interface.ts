import { ConfigModel } from '../../models/config.model';
import { GHSSymbols } from '../../models/global.model';
import { Observable } from 'rxjs';

export const CONFIG_SERVICE = 'IConfigService';

export interface IConfigService {
  getProgramVersion(): Observable<string>;

  getConfig(): Observable<ConfigModel>;

  saveConfig(config: ConfigModel): Observable<void>;

  getHazardSymbols(): Observable<GHSSymbols>;

  getPromptHtml(name: string): Observable<string>;
}
