import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { promisified } from 'tauri/api/tauri';
import { Data } from './chemicalInfo.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor() {
  }

  searchSuggestions(zvgNumber: string): Observable<Data> {
    return from(
      promisified<Data>({
        cmd: 'getChemicalInfo',
        zvgNumber: zvgNumber,
      })
    );
  }
}
