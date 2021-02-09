import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {promisified} from 'tauri/api/tauri';
import {SubstanceData} from './substances.model';

@Injectable({
  providedIn: 'root'
})
export class SubstancesService {
  constructor() {
  }

  substanceInfo(zvgNumber: string): Observable<SubstanceData> {
    return from(
      promisified<SubstanceData>({
        cmd: 'getSubstanceData',
        zvgNumber,
      })
    );
  }
}
