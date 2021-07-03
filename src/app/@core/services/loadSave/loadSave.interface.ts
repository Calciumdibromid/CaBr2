import { CaBr2Document, DocumentTypes } from './loadSave.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export abstract class ILoadSaveService {
  abstract saveDocument(fileType: string, filename: string, document: CaBr2Document): Observable<string>;

  abstract loadDocument(filename: string): Observable<CaBr2Document>;

  abstract getAvailableDocumentTypes(): Observable<DocumentTypes>;
}
