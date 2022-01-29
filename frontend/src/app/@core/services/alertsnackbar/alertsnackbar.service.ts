import { Alert, AlertType } from './alertsnackbar.model';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertSubject = new Subject<Alert>();

  onAlert(): Observable<Alert> {
    return this.alertSubject.asObservable();
  }

  success(message: string): void {
    this.alert(new Alert({ type: AlertType.Success, message }));
  }

  error(message: string): void {
    this.alert(new Alert({ type: AlertType.Error, message }));
  }

  info(message: string): void {
    this.alert(new Alert({ type: AlertType.Info, message }));
  }

  // core alert method
  private alert(alert: Alert): void {
    this.alertSubject.next(alert);
  }
}
