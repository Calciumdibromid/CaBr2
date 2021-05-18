import { CaBr2Document, DocumentTypes } from '../loadSave.model';
import { ILoadSaveService } from '../loadSave.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceModule } from '../../service.module';

@Injectable({
  providedIn: ServiceModule,
})
export class LoadSaveService implements ILoadSaveService {
  saveDocument(fileType: string, filename: string, document: CaBr2Document): Observable<string> {
    throw new Error('Method not implemented.');
  }

  loadDocument(filename: string): Observable<CaBr2Document> {
    throw new Error('Method not implemented.');
  }

  getAvailableDocumentTypes(): Observable<DocumentTypes> {
    throw new Error('Method not implemented.');
  }
}
