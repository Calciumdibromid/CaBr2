import { ConfigModel } from '../../models/config.model';
import { GHSSymbols } from '../../models/global.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TauriService } from '../tauri/tauri.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(private tauriService: TauriService) {}

  getProgramVersion(): Observable<string> {
    return this.tauriService.promisified('plugin:cabr2_config|get_program_version');
  }

  getConfig(): Observable<ConfigModel> {
    return this.tauriService.promisified('plugin:cabr2_config|get_config');
  }

  saveConfig(config: ConfigModel): Observable<void> {
    return this.tauriService.promisified('plugin:cabr2_config|save_config', { config });
  }

  getHazardSymbols(): Observable<GHSSymbols> {
    return this.tauriService.promisified('plugin:cabr2_config|get_hazard_symbols');
  }

  getPromptHtml(name: string): Observable<string> {
    return this.tauriService.promisified('plugin:cabr2_config|get_prompt_html', { name });
  }
}
