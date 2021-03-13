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
import { ManualComponent } from './manual/manual.component';
import { MatModules } from './@core/modules/mat.modules';
import { MenubarComponent } from './menubar/menubar.component';
import { ModifiableStringListComponent } from './modifiable-string-list/modifiable-string-list.component';
import { PreviewComponent } from './preview/preview.component';
import { SearchComponent } from './search/search.component';
import { SearchDialogComponent } from './search/search-dialog/search-dialog.component';
import { SelectedSearchComponent } from './search/selected-search/selected-search.component';
import { YesNoDialogComponent } from './yes-no-dialog/yes-no-dialog.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenubarComponent,
    SearchComponent,
    ModifiableStringListComponent,
    PreviewComponent,
    SelectedSearchComponent,
    SearchDialogComponent,
    EditSearchResultsComponent,
    ManualComponent,
    YesNoDialogComponent,
    SettingsComponent,
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule, MatModules, AlertModule],
  providers: [GlobalModel, ConfigModel],
  bootstrap: [AppComponent],
})
export class AppModule {}
