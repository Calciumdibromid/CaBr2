import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ConfigModel } from './@core/models/config.model';
import { GlobalModel } from './@core/models/global.model';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { ListInputSpecifcationsComponent } from './list-input-specifcations/list-input-specifcations.component';
import { MatModules } from './@core/modules/MatModules';
import { MenubarComponent } from './menubar/menubar.component';
import { NgModule } from '@angular/core';
import { PreviewComponent } from './preview/preview.component';
import { PrintPreviewComponent } from './print-preview/print-preview.component';
import { SearchComponent } from './search/search.component';
import { SearchDialogComponent } from './search/search-dialog/search-dialog.component';
import { SelectedSearchComponent } from './search/selected-search/selected-search.component';
import { AlertsnackbarComponent } from './alertsnackbar/alertsnackbar.component';
import { AlertModule } from './@core/modules/alert.module';


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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatModules,
    AlertModule,
  ],
  providers: [
    GlobalModel,
    ConfigModel
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
