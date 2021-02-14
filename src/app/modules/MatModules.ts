import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const modules = [
  MatIconModule,
  MatInputModule,
  MatSidenavModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatTooltipModule,
  MatSelectModule,
  MatMenuModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatListModule,
  MatDividerModule,
  ScrollingModule,
  MatCardModule,
  MatSlideToggleModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MatModules {
}
