import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { promisified } from 'tauri/api/tauri';
import { CaBr2Document } from './loadSave.model';

@Injectable({
  providedIn: 'root',
})
export class LoadSaveService {
  constructor() {}

  saveDocument(
    fileType: string,
    filename: string,
    document: CaBr2Document
  ): Observable<string> {
    return from(
      promisified<string>({
        cmd: 'saveDocument',
        fileType,
        filename,
        document,
      })
    );
  }

  loadDocument(filename: string): Observable<CaBr2Document> {
    return from(
      promisified<CaBr2Document>({
        cmd: 'loadDocument',
        filename,
      })
    );
  }
}
