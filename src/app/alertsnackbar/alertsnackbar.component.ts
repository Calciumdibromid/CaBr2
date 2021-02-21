import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import { Alert, AlertType } from '../@core/services/alertsnackbar/altersnackbar.model';
import { AlertService } from '../@core/services/alertsnackbar/altersnackbar.service';

@Component({
  selector: 'app-alertsnackbar',
  template: '<div></div>',
  styleUrls: ['./alertsnackbar.component.scss'],
})
export class AlertsnackbarComponent implements OnInit, OnDestroy {
  @Input()
  id = 'default-alert';

  @Input()
  fade = true;

  alerts: Alert[] = [];
  alertSubscription!: Subscription;

  constructor(
    private alertService: AlertService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // subscribe to new alert notifications
    this.alertSubscription = this.alertService.onAlert(this.id).subscribe((alert) => {
      // clear alerts when an empty alert is received
      if (!alert.message) {
        return;
      }

      // add alert to array
      this.alerts.push(alert);

      // auto close alert if required
      if (alert.autoClose) {
        // TODO cleanup
        setTimeout(() => this.removeAlert(alert), 3000);
      }

      this.openSnackBar();
    });
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.alertSubscription.unsubscribe();
  }

  removeAlert(alert: Alert) {
    // check if already removed to prevent error on auto close
    if (!this.alerts.includes(alert)) {
      return;
    }

    if (this.fade) {
      // fade out alert
      const foundAlert = this.alerts.find((x) => x === alert);
      if (foundAlert) {
        foundAlert.fade = true;
      }

      // remove alert after faded out
      setTimeout(() => {
        this.alerts = this.alerts.filter((x) => x !== alert);
      }, 250);
    } else {
      // remove alert
      this.alerts = this.alerts.filter((x) => x !== alert);
    }
  }

  cssClass(alert: Alert) {
    if (!alert) {
      return;
    }

    const classes = ['alert', 'alert-dismissable'];

    const alertTypeClass = {
      [AlertType.Success]: 'alert-success',
      [AlertType.Error]: 'alert-error',
      [AlertType.Info]: 'alert-info',
    };

    classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
      classes.push('fade');
    }

    return classes;
  }

  openSnackBar() {
    this.snackBar.openFromComponent(AlertComponent, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      data: {
        alerts: this.alerts,
      },
      panelClass: this.cssClass(this.alerts[0]),
    });
  }
}

@Component({
  selector: 'app-alert-helper',
  templateUrl: './alertsnackbar.component.html',
  styleUrls: ['./alertsnackbar.component.scss'],
})
export class AlertComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: {
      alerts: Alert[];
    },
  ) {
  }

  cssClass(alert: Alert) {
    if (!alert) {
      return;
    }

    const classes = ['alert', 'alert-dismissable'];

    const alertTypeClass = {
      [AlertType.Success]: 'alert alert-success',
      [AlertType.Error]: 'alert alert-error',
      [AlertType.Info]: 'alert alert-info',
    };

    classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
      classes.push('fade');
    }

    return classes.join(' ');
  }
}
