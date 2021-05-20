import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AlertModule } from './@core/modules/alert.module';
import { AppComponent } from './app.component';
import { ConsentComponent } from './consent/consent.component';
import { EditSubstanceDataComponent } from './edit-substance-data/edit-substance-data.component';
import { GlobalModel } from './@core/models/global.model';
import { HeaderComponent } from './header/header.component';
import { LoadingComponent } from './loading/loading.component';
import { ManualComponent } from './manual/manual.component';
import { MatModules } from './@core/modules/mat.module';
import { MenubarComponent } from './menubar/menubar.component';
import { ModifiableStringListComponent } from './modifiable-string-list/modifiable-string-list.component';
import { PreviewComponent } from './preview/preview.component';
import { ReportBugComponent } from './report-bug/report-bug.component';
import { SearchComponent } from './search/search.component';
import { SearchDialogComponent } from './search/search-dialog/search-dialog.component';
import { SelectedSearchComponent } from './search/selected-search/selected-search.component';
import { ServiceModule } from './@core/services/service.module';
import { SettingsComponent } from './settings/settings.component';
import { SubMolecularFormula } from './@core/pipes/molecularformula.pipe';
import { YesNoDialogComponent } from './yes-no-dialog/yes-no-dialog.component';

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
    EditSubstanceDataComponent,
    ManualComponent,
    YesNoDialogComponent,
    SettingsComponent,
    ReportBugComponent,
    ConsentComponent,
    SubMolecularFormula,
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatModules,
    AlertModule,
    ServiceModule,
  ],
  providers: [GlobalModel, ServiceModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
