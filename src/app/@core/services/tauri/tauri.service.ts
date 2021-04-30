import { from, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { dialog, shell, tauri } from '@tauri-apps/api/index.js';
import { InvokeArgs } from '@tauri-apps/api/tauri';

@Injectable({
  providedIn: 'root',
})
export class TauriService {
  openUrl = shell.open;

  open(options?: dialog.OpenDialogOptions): Observable<string | string[]> {
    return from(dialog.open(options));
  }

  save(options?: dialog.SaveDialogOptions): Observable<string | string[]> {
    return from(dialog.save(options));
  }

  promisified<T>(cmd: string, args?: InvokeArgs): Observable<T> {
    return from(tauri.invoke<T>(cmd, args));
  }
}

type DialogFilter = dialog.DialogFilter;

export { DialogFilter };
