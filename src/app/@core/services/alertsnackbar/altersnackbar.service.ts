import { Alert, AlertType } from './altersnackbar.model';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertSubject = new Subject<Alert>();
  private id = 'default-alert';

  onAlert(id = this.id): Observable<Alert> {
    return this.alertSubject.asObservable().pipe(filter((alert) => alert && alert.id === id));
  }

  success(message: string, options?: any): void {
    this.alert(new Alert({ ...options, type: AlertType.Success, message }));
  }

  error(message: string, options?: any): void {
    this.alert(new Alert({ ...options, type: AlertType.Error, message }));
  }

  info(message: string, options?: any): void {
    this.alert(new Alert({ ...options, type: AlertType.Info, message }));
  }

  // core alert method
  alert(alert: Alert): void {
    alert.id = alert.id || this.id;
    alert.autoClose = alert.autoClose === undefined ? true : alert.autoClose;
    this.alertSubject.next(alert);
  }

  // clear alerts
  clear(id = this.id): void {
    this.alertSubject.next(new Alert({ id }));
  }
}
