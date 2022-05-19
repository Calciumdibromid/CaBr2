import { first, map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import * as wasm from 'cabr2_wasm';
import { CaBr2Document, DocumentTypes } from '../loadSave.model';
import { environment } from 'src/environments/environment';
import { ILoadSaveService } from '../loadSave.interface';
import Logger from 'src/app/@core/utils/logger';
import { ProgressDialogComponent } from 'src/app/components/progress-dialog/progress-dialog.component';

const logger = new Logger('loadSaveService.web');

const URL = window.webkitURL || window.URL;

const SERVER_URL = environment.serverUrl;

const getFileType = (file: File): string => {
  const fileTypeSplit = file.name.split('.');
  return fileTypeSplit[fileTypeSplit.length - 1];
};

const downloadFile = (contents: Blob, filename: string): void => {
  const data = URL.createObjectURL(contents);

  const anchor = document.createElement('a');
  anchor.download = filename;
  anchor.href = data;
  anchor.click();

  setTimeout(() => {
    URL.revokeObjectURL(data);
    anchor.remove();
  }, 100);
};

@Injectable()
export class LoadSaveService implements ILoadSaveService {
  constructor(private httpClient: HttpClient, private dialog: MatDialog) {}

  saveDocument(fileType: string, filename: string, document: CaBr2Document): Observable<string> {
    return new Observable((sub) => {
      switch (fileType) {
        case 'pdf':
          const download = this.httpClient
            .post<SaveDocumentResponse>(SERVER_URL + 'loadSave/saveDocument', {
              fileType,
              document,
            })
            .pipe(first());

          this.dialog.open(ProgressDialogComponent, {
            panelClass: ['unselectable', 'undragable'],
            data: {
              download,
              subscriber: sub,
              callback: (url: string) => {
                this.httpClient.get(url, { observe: 'response', responseType: 'blob' }).subscribe((response) => {
                  const body = response.body;

                  if (body === null) {
                    logger.error('server returned no pdf');
                    sub.error('server returned no pdf');
                    return;
                  }

                  // with every other type Firefox opens the file in a new tab -.-
                  downloadFile(new Blob([body], { type: 'text/plain' }), filename);

                  sub.next();
                });
              },
            },
          });
          break;

        default:
          logger.debug('saving file with wasm:', fileType);
          wasm
            .save_document(fileType, JSON.stringify(document))
            .then((contents: Uint8Array) => {
              const blob2 = new Blob([contents], { type: 'application/octet-stream' });
              downloadFile(blob2, filename);
              sub.next();
            })
            .catch((err: any) => sub.error(err));
          break;
      }
    });
  }

  loadDocument(file: File): Observable<CaBr2Document> {
    const fileType = getFileType(file);

    const reader = new FileReader();
    logger.debug('opening file with wasm:', file.name);
    return new Observable((sub) => {
      reader.onload = () => {
        const res = reader.result as ArrayBuffer;
        wasm
          .load_document(fileType, new Uint8Array(res))
          .then((contents: string) => sub.next(JSON.parse(contents)))
          .catch((err: any) => sub.error(err));
      };
      reader.readAsArrayBuffer(file);
    });
  }

  getAvailableDocumentTypes(): Observable<DocumentTypes> {
    return from(wasm.get_available_document_types() as Promise<string>).pipe(map((types) => JSON.parse(types)));
  }
}

interface SaveDocumentResponse {
  downloadUrl: string;
}
