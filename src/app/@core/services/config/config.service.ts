import { Inject, Injectable } from '@angular/core';
import { ConfigModel } from '../../models/config.model';
import { GHSSymbols } from '../../models/global.model';
import { IConfigService } from './config.interface';
import { NATIVE_SERVICE } from '../native/native.interface';
import { Observable } from 'rxjs';
import { ServiceModule } from '../service.module';
import { TauriService } from '../native/tauri.service';

@Injectable({
  providedIn: ServiceModule,
})
export class ConfigService implements IConfigService {
  constructor(@Inject(NATIVE_SERVICE) private tauriService: TauriService) {}

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
