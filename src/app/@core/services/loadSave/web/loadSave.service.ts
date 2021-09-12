import { from, Observable, Subscriber } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CaBr2Document, DocumentTypes } from '../loadSave.model';
import { environment } from 'src/environments/environment';
import { ILoadSaveService } from '../loadSave.interface';
import Logger from 'src/app/@core/utils/logger';
import { ProgressDialogComponent } from 'src/app/progress-dialog/progress-dialog.component';
import * as wasm from 'cabr2_wasm';

const logger = new Logger('loadSaveService.web');

const SERVER_URL =
  ((): string => {
    if (environment.production) {
      return 'https://api.cabr2.de/';
    } else {
      return 'http://localhost:3030/';
    }
  })() + 'api/v1/';

@Injectable()
export class LoadSaveService implements ILoadSaveService {
  constructor(private httpClient: HttpClient, private dialog: MatDialog) { }

  saveDocument(fileType: string, _: string, document: CaBr2Document): Observable<string> {
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
            },
          });
          break;

        case 'cb2':
          const blob = new Blob([JSON.stringify(document)], { type: 'text/plain' });
          downloadFile(blob, fileType);
          sub.next();
          break;

        default:
          logger.debug('saving file with wasm:', fileType);
          wasm.save_document(fileType, JSON.stringify(document))
            .then((contents: string) => {
              // `atob` is deprecated but `Buffer.from()` results in optimization problems with Angular.
              // I'm pretty sure `atob` won't be removed from browsers in the forseeable future so it should be ok ^^.
              const blob2 = new Blob([atob(contents)], { type: 'application/octet-stream' });
              downloadFile(blob2, fileType);
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

    switch (fileType) {
      case 'cb2':
        return new Observable((sub) => {
          reader.onload = () => sub.next(JSON.parse(reader.result as string));
          reader.readAsText(file);
        });

      default:
        logger.debug('opening file with wasm:', file.name);
        return new Observable((sub) => {
          reader.onload = () => {
            const res = reader.result as ArrayBuffer;
            wasm.load_document(fileType, new Uint8Array(res))
              .then((contents: string) => sub.next(JSON.parse(contents)))
              .catch((err: any) => sub.error(err));
          };
          reader.readAsArrayBuffer(file);
        });
    }
  }

  getAvailableDocumentTypes(): Observable<DocumentTypes> {
    return from(wasm.get_available_document_types() as Promise<string>)
      .pipe(map((types) => JSON.parse(types)));
  }
}

const getFileType = (file: File): string => {
  const fileTypeSplit = file.name.split('.');
  return fileTypeSplit[fileTypeSplit.length - 1];
};

const downloadFile = (contents: Blob, fileType: string) => {
  const anchor = document.createElement('a');
  anchor.download = 'Unbenannt.' + fileType;
  anchor.href = (window.webkitURL || window.URL).createObjectURL(contents);
  anchor.dataset.downloadurl = [contents.type, anchor.download, anchor.href].join(':');
  anchor.click();
};

interface SaveDocumentResponse {
  downloadUrl: string;
}
