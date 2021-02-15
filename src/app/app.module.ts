import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { ListInputSpecifcationsComponent } from './list-input-specifcations/list-input-specifcations.component';
import { MatModules } from './modules/MatModules';
import { MenubarComponent } from './menubar/menubar.component';
import { NgModule } from '@angular/core';
import { PreviewComponent } from './preview/preview.component';
import { PrintPreviewComponent } from './print-preview/print-preview.component';
import { SearchComponent } from './search/search.component';
import { SearchDialogComponent } from './search/search-dialog/search-dialog.component';
import { EditSearchResultsComponent } from './search/edit-search-results/edit-search-results.component';
import { GlobalModel } from './@core/models/global.model';

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
    HttpClientModule,
    MatModules,
  ],
  providers: [GlobalModel],
  bootstrap: [AppComponent]
})
export class AppModule { }
