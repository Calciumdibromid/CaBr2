import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { CaBr2Document } from '../../@core/services/loadSave/loadSave.model';
import { DialogFilter } from '../../@core/services/native/tauri.service';
import FunctionsService from 'src/app/@core/services/file-functions';
import { GlobalModel } from '../../@core/models/global.model';
import { IConfigService } from '../../@core/services/config/config.interface';
import { LocalizedStrings } from '../../@core/services/i18n/i18n.interface';
import { ManualComponent } from '../manual/manual.component';
import { ReportBugComponent } from '../report-bug/report-bug.component';
import { SettingsComponent } from '../settings/settings.component';
import TEMPLATES from '../../../assets/docsTemplate.json';

const DOCS_TEMPLATE = TEMPLATES.docsTemplate;

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss'],
})
export class MenubarComponent implements OnInit {
  @Output()
  readonly darkModeSwitched = new EventEmitter<boolean>();

  strings!: LocalizedStrings;

  programmVersion!: string;

  constructor(
    public globals: GlobalModel,
    private configService: IConfigService,
    private dialog: MatDialog,
    private functionService: FunctionsService,
  ) {
    this.globals.localizedStringsObservable.subscribe((strings) => (this.strings = strings));
  }

  ngOnInit(): void {
    this.globals.loadTemplate(DOCS_TEMPLATE);

    this.configService
      .getProgramVersion()
      .pipe(first())
      .subscribe((version) => (this.programmVersion = version));
  }

  newDocument(): void {
    this.globals.loadTemplate(DOCS_TEMPLATE);
  }

  scroll(el: HTMLElement): void {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  openMail(): void {
    this.dialog.open(ReportBugComponent);
  }

  loadFile(): void {
    this.functionService.loadFile();
  }

  saveFile(type: DialogFilter, document: CaBr2Document): void {
    this.functionService.saveFile(type, document);
  }

  openManualDialog(): void {
    this.configService.getPromptHtml('gettingStarted').subscribe((html) => {
      this.dialog.open(ManualComponent, {
        data: {
          content: html,
        },
      });
    });
  }

  openSettingsDialog(): void {
    const dialogRef = this.dialog.open(SettingsComponent);

    dialogRef.componentInstance.darkModeSwitched.subscribe((checked: boolean) => {
      this.darkModeSwitched.emit(checked);
    });
  }

  exportCB2File(): void {
    this.functionService.exportFile({ name: 'CaBr2', extensions: ['cb2'] }, DOCS_TEMPLATE);
  }

  exportPDFFile(): void {
    this.functionService.exportFile({ name: 'PDF', extensions: ['pdf'] }, DOCS_TEMPLATE);
  }
}
