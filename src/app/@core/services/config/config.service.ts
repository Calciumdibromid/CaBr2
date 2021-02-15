import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigModel } from '../../models/config.model';
import { TauriService } from '../tauri/tauri.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(
    private tauriService: TauriService,
  ) {
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
}
