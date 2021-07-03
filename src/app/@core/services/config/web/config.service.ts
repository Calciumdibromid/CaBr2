import { ConfigModel } from 'src/app/@core/models/config.model';
import { GHSSymbols } from 'src/app/@core/models/global.model';
import { IConfigService } from '../config.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO use vars and remove this lines
@Injectable()
export class ConfigWebService implements IConfigService {
  getProgramVersion(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  getConfig(): Observable<ConfigModel> {
    throw new Error('Method not implemented.');
  }

  //@typescript-eslint-disable-next-line no-unused-vars
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
