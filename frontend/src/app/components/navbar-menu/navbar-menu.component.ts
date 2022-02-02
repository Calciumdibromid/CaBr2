import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';

import { ClearAllSubstanceData } from 'src/app/@core/states/substance-data.state';
import DocumentService from 'src/app/@core/services/document/document.service';
import { INativeService } from 'src/app/@core/services/native/native.interface';
import { ResetSentences as ResetDisposalSentence } from 'src/app/@core/actions/disposal.actions';
import { ResetHeader } from 'src/app/@core/states/header.state';
import { ResetSentences as ResetHumanAndEnvironmentDangerSentences } from 'src/app/@core/actions/human-and-environment-danger.actions';
import { ResetSentences as ResetInCaseOfDangerSentences } from 'src/app/@core/actions/in-case-of-danger.actions';
import { ResetSentences as ResetRulesOfConductSentences } from 'src/app/@core/actions/rules-of-conduct-acitons';
import { SettingsComponent } from '../settings/settings.component';
import TEMPLATES from '../../../assets/docsTemplate.json';

const DOCS_TEMPLATE = TEMPLATES.docsTemplate;

@Component({
  selector: 'app-navbar-menu',
  templateUrl: './navbar-menu.component.html',
  styleUrls: ['./navbar-menu.component.scss'],
})
export class NavbarMenuComponent implements OnInit {
  constructor(
    private nativeService: INativeService,
    private documentService: DocumentService,
    private dialog: MatDialog,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.newDocument();
  }

  newDocument(): void {
    this.store.dispatch([
      new ResetHeader(),
      new ClearAllSubstanceData(),
      new ResetHumanAndEnvironmentDangerSentences(),
      new ResetRulesOfConductSentences(),
      new ResetInCaseOfDangerSentences(),
      new ResetDisposalSentence(),
    ]);
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
    this.dialog.open(SettingsComponent);
  }

  openManualDialog(): void {
    this.nativeService.openUrl('http://cabr2.de/anleitung.html');
  }
}
