import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import DocumentService from 'src/app/@core/services/document/document.service';
import { GlobalModel } from 'src/app/@core/models/global.model';
import { IConfigService } from 'src/app/@core/services/config/config.interface';
import { LocalizedStrings } from 'src/app/@core/services/i18n/i18n.interface';
import { ManualComponent } from '../manual/manual.component';
import { SettingsComponent } from '../settings/settings.component';
import TEMPLATES from '../../../assets/docsTemplate.json';

const DOCS_TEMPLATE = TEMPLATES.docsTemplate;

@Component({
  selector: 'app-navbar-menu',
  templateUrl: './navbar-menu.component.html',
  styleUrls: ['./navbar-menu.component.scss'],
})
export class NavbarMenuComponent implements OnInit {
  @Output()
  readonly darkModeSwitched = new EventEmitter<boolean>();

  strings!: LocalizedStrings;

  constructor(
    public globals: GlobalModel,
    private documentService: DocumentService,
    private configService: IConfigService,
    private dialog: MatDialog,
  ) {
    this.globals.localizedStringsObservable.subscribe((strings) => (this.strings = strings));
  }

  ngOnInit(): void {
    this.newDocument();
  }

  newDocument(): void {
    this.globals.loadTemplate(DOCS_TEMPLATE);
  }

  loadFile(): void {
    this.documentService.loadFile();
  }

  exportCB2File(): void {
    this.documentService.exportFile({ name: 'CaBr2', extensions: ['cb2'] }, DOCS_TEMPLATE);
  }

  exportPDFFile(): void {
    this.documentService.exportFile({ name: 'PDF', extensions: ['pdf'] }, DOCS_TEMPLATE);
  }

  openSettingsDialog(): void {
    const dialogRef = this.dialog.open(SettingsComponent);

    dialogRef.componentInstance.darkModeSwitched.subscribe((checked: boolean) => {
      this.darkModeSwitched.emit(checked);
    });
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
}
