import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    imports: [
        MatIconModule,
        MatInputModule,
        MatSidenavModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatTooltipModule,
        MatSelectModule,
    ],
    exports: [
        MatIconModule,
        MatInputModule,
        MatSidenavModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatTooltipModule,
        MatSelectModule,
    ],
})
export class MatModules { }