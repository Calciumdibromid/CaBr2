import { CaBr2Document, DocumentTypes } from './loadSave.model';
import { Observable } from 'rxjs';

export const LOAD_SAVE_SERVICE = 'ILoadSaveService';

export interface ILoadSaveService {
  saveDocument(fileType: string, filename: string, document: CaBr2Document): Observable<string>;

  loadDocument(filename: string): Observable<CaBr2Document>;

  getAvailableDocumentTypes(): Observable<DocumentTypes>;
}
