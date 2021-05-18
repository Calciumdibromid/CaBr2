import { ConfigModel } from 'src/app/@core/models/config.model';
import { GHSSymbols } from 'src/app/@core/models/global.model';
import { IConfigService } from '../config.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceModule } from '../../service.module';

@Injectable({
  providedIn: ServiceModule,
})
export class ConfigWebService implements IConfigService {
  getProgramVersion(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  getConfig(): Observable<ConfigModel> {
    throw new Error('Method not implemented.');
  }

  saveConfig(config: ConfigModel): Observable<void> {
    throw new Error('Method not implemented.');
  }

  getHazardSymbols(): Observable<GHSSymbols> {
    throw new Error('Method not implemented.');
  }

  getPromptHtml(name: string): Observable<string> {
    throw new Error('Method not implemented.');
  }
}
