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
    return this.tauriService.promisified({
      cmd: 'getProgramVersion',
    });
  }

  getConfig(): Observable<ConfigModel> {
    return this.tauriService.promisified({
      cmd: 'getConfig',
    });
  }

  saveConfig(config: ConfigModel): Observable<void> {
    return this.tauriService.promisified({
      cmd: 'saveConfig',
      config,
    });
  }

  getHazardSymbols(): Observable<GHSSymbols> {
    return this.tauriService.promisified({
      cmd: 'getHazardSymbols',
    });
  }

  getPromptHtml(name: string): Observable<string> {
    return this.tauriService.promisified({
      cmd: 'getPromptHtml',
      name,
    });
  }
}
