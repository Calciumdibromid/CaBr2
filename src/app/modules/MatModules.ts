import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
    imports: [
        MatIconModule,
        MatInputModule,
        MatSidenavModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatTooltipModule,
        MatSelectModule,
        MatMenuModule,
    ],
    exports: [
        MatIconModule,
        MatInputModule,
        MatSidenavModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatTooltipModule,
        MatSelectModule,
        MatMenuModule,
    ],
})
export class MatModules { }