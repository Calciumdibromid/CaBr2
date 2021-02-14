import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CaBr2Document} from './loadSave.model';
import {TauriService} from '../tauri/tauri.service';

@Injectable({
  providedIn: 'root',
})
export class LoadSaveService {
  constructor(
    private tauriService: TauriService,
  ) {}

  saveDocument(
    fileType: string,
    filename: string,
    document: CaBr2Document
  ): Observable<string> {
    return this.tauriService.promisified({
      cmd: 'saveDocument',
      fileType,
      filename,
      document,
    });
  }

  loadDocument(filename: string): Observable<CaBr2Document> {
    return this.tauriService.promisified({
      cmd: 'loadDocument',
      filename,
    });
  }
}
