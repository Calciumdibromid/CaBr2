import { from, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import * as dialog from '@tauri-apps/api/dialog';
import * as shell from '@tauri-apps/api/shell';
import * as tauri from '@tauri-apps/api/tauri';

import { INativeService } from './native.interface';
import { InvokeArgs } from '@tauri-apps/api/tauri';

@Injectable()
export class TauriService implements INativeService {
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
