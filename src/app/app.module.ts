import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AlertModule } from './@core/modules/alert.module';
import { AppComponent } from './app.component';
import { BugReportButtonComponent } from './components/bug-report-button/bug-report-button.component';
import { ConsentComponent } from './components/consent/consent.component';
import { EditSubstanceDataComponent } from './components/edit-substance-data/edit-substance-data.component';
import { ExportButtonsComponent } from './components/export-buttons/export-buttons.component';
import { GlobalModel } from './@core/models/global.model';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { LoadingComponent } from './components/loading/loading.component';
import { ManualComponent } from './components/manual/manual.component';
import { MatModules } from './@core/modules/mat.module';
import { ModifiableStringListComponent } from './components/modifiable-string-list/modifiable-string-list.component';
import { NavbarMenuComponent } from './components/navbar-menu/navbar-menu.component';
import { OnePagerComponent } from './onepager/onepager.component';
import { PreviewComponent } from './components/preview/preview.component';
import { ProgressDialogComponent } from './progress-dialog/progress-dialog.component';
import { ReportBugComponent } from './components/report-bug/report-bug.component';
import { ScrollbuttonComponent } from './components/scrollbutton/scrollbutton.component';
import { SearchComponent } from './components/search/search.component';
import { SearchDialogComponent } from './components/search/search-dialog/search-dialog.component';
import { SecurityThingsComponent } from './components/security-things/security-things.component';
import { SelectedSearchComponent } from './components/search/selected-search/selected-search.component';
import { ServiceModule } from './@core/services/service.module';
import { SettingsComponent } from './components/settings/settings.component';
import { SubMolecularFormula } from './@core/pipes/molecularformula.pipe';
import { YesNoDialogComponent } from './components/yes-no-dialog/yes-no-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
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
    ProgressDialogComponent,
    OnePagerComponent,
    NavbarMenuComponent,
    ScrollbuttonComponent,
    SecurityThingsComponent,
    ExportButtonsComponent,
    BugReportButtonComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatModules,
    AlertModule,
    ServiceModule,
    HttpClientModule,
  ],
  providers: [GlobalModel],
  bootstrap: [AppComponent],
})
export class AppModule {}
