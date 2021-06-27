import { ConfigModel } from '../../models/config.model';
import { GHSSymbols } from '../../models/global.model';
import { IConfigService } from './config.interface';
import { INativeService } from '../native/native.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ConfigService implements IConfigService {
  constructor(private nativeService: INativeService) {}

  getProgramVersion(): Observable<string> {
    return this.nativeService.promisified('plugin:cabr2_config|get_program_version');
  }

  getConfig(): Observable<ConfigModel> {
    return this.nativeService.promisified('plugin:cabr2_config|get_config');
  }

  saveConfig(config: ConfigModel): Observable<void> {
    return this.nativeService.promisified('plugin:cabr2_config|save_config', { config });
  }

  getHazardSymbols(): Observable<GHSSymbols> {
    return this.nativeService.promisified('plugin:cabr2_config|get_hazard_symbols');
  }

  getPromptHtml(name: string): Observable<string> {
    return this.nativeService.promisified('plugin:cabr2_config|get_prompt_html', { name });
  }
}
