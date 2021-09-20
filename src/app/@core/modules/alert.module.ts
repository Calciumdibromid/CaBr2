import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertsnackbarComponent } from '../../components/alertsnackbar/alertsnackbar.component';

@NgModule({
  imports: [CommonModule],
  declarations: [AlertsnackbarComponent],
  exports: [AlertsnackbarComponent],
})
export class AlertModule {}
