import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertComponent, AlertsnackbarComponent } from '../../alertsnackbar/alertsnackbar.component';

@NgModule({
  imports: [CommonModule],
  declarations: [AlertsnackbarComponent, AlertComponent],
  exports: [AlertsnackbarComponent, AlertComponent],
})
export class AlertModule { }
