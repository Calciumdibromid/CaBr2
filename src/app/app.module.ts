import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AlertModule } from './@core/modules/alert.module';
import { AppComponent } from './app.component';
import { ConfigModel } from './@core/models/config.model';
import { EditSearchResultsComponent } from './search/edit-search-results/edit-search-results.component';
import { GlobalModel } from './@core/models/global.model';
import { HeaderComponent } from './header/header.component';
import { ListInputSpecifcationsComponent } from './list-input-specifcations/list-input-specifcations.component';
import { MatModules } from './@core/modules/MatModules';
import { MenubarComponent } from './menubar/menubar.component';
import { PreviewComponent } from './preview/preview.component';
import { PrintPreviewComponent } from './print-preview/print-preview.component';
import { SearchComponent } from './search/search.component';
import { SearchDialogComponent } from './search/search-dialog/search-dialog.component';
import { SelectedSearchComponent } from './search/selected-search/selected-search.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenubarComponent,
    SearchComponent,
    ListInputSpecifcationsComponent,
    PreviewComponent,
    PrintPreviewComponent,
    SelectedSearchComponent,
    SearchDialogComponent,
    EditSearchResultsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatModules,
    AlertModule,
  ],
  providers: [GlobalModel, ConfigModel],
  bootstrap: [AppComponent],
})
export class AppModule {}
