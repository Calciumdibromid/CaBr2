import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubstanceData } from './substances.model';
import { TauriService } from '../tauri/tauri.service';

@Injectable({
  providedIn: 'root',
})
export class SubstancesService {
  constructor(private tauriService: TauriService) {}

  substanceInfo(provider: string, identifier: string): Observable<SubstanceData> {
    return this.tauriService.promisified({
      cmd: 'getSubstanceData',
      provider,
      identifier,
    });
  }
}
