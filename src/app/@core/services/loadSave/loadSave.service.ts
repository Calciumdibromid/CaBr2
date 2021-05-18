import { CaBr2Document, DocumentTypes } from './loadSave.model';
import { ILoadSaveService } from './loadSave.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceModule } from '../service.module';
import { TauriService } from '../tauri/tauri.service';

@Injectable({
  providedIn: ServiceModule,
})
export class LoadSaveService implements ILoadSaveService {
  constructor(private tauriService: TauriService) {}

  saveDocument(fileType: string, filename: string, document: CaBr2Document): Observable<string> {
    return this.tauriService.promisified('plugin:cabr2_load_save|save_document', {
      fileType,
      filename,
      document,
    });
  }

  loadDocument(filename: string): Observable<CaBr2Document> {
    return this.tauriService.promisified('plugin:cabr2_load_save|load_document', { filename });
  }

  getAvailableDocumentTypes(): Observable<DocumentTypes> {
    return this.tauriService.promisified('plugin:cabr2_load_save|get_available_document_types');
  }
}
