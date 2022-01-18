import { Alert, AlertType } from '../../@core/services/alertsnackbar/altersnackbar.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { AlertService } from '../../@core/services/alertsnackbar/altersnackbar.service';
import Logger from '../../@core/utils/logger';
import { Subscription } from 'rxjs';

const logger = new Logger('alertsnackbar');

@Component({
  selector: 'app-alertsnackbar',
  template: '<div></div>',
})
export class AlertsnackbarComponent implements OnInit, OnDestroy {
  alertSubscription!: Subscription;

  snackBarVisible = false;

  alerts: Alert[] = [];

  constructor(private alertService: AlertService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // subscribe to new alert notifications
    this.alertSubscription = this.alertService.onAlert().subscribe({
      next: (alert) => {
        // clear alerts when an empty alert is received
        if (!alert.message) {
          throw Error('Empty alert message');
        }

        this.alerts.push(alert);

        if (!this.snackBarVisible) {
          this.showSnackbar();
        }
      },
      error: (err) => logger.error('creating snackbar failed:', err),
    });
  }

  ngOnDestroy(): void {
    this.alertSubscription.unsubscribe();
  }

  cssClass(alert: Alert): string {
    const alertTypeClass = {
      [AlertType.Success]: 'alert-success',
      [AlertType.Error]: 'alert-error',
      [AlertType.Info]: 'alert-info',
    };

    return alertTypeClass[alert.type];
  }

  openSnackBar(): MatSnackBarRef<TextOnlySnackBar> | undefined {
    const alert = this.alerts.shift();
    if (alert) {
      this.snackBarVisible = true;
      return this.snackBar.open(alert.message, '', {
        duration: 6000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: this.cssClass(alert),
      });
    }
    return;
  }

  private showSnackbar(): void {
    this.openSnackBar()
      ?.afterDismissed()
      .subscribe({
        next: () => {
          this.snackBarVisible = false;
          this.showSnackbar();
        },
        error: (err) => logger.error('snackbar dismissing failed:', err),
      });
  }
}
