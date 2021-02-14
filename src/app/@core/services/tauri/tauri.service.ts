import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import * as dialog from 'tauri/api/dialog';
import * as tauri from 'tauri/api/tauri';

@Injectable({
  providedIn: 'root'
})
export class TauriService {

  constructor() {}

  open(options?: dialog.OpenDialogOptions): Observable<string | string[]> {
    return from(
      dialog.open(options)
    );
  }

  save(options?: dialog.SaveDialogOptions): Observable<string | string[]> {
    return from(
      dialog.save(options)
    );
  }

  promisified<T>(args: any): Observable<T> {
    return from(
      tauri.promisified<T>(args)
    );
  }
}
