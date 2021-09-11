import { Component, Input } from '@angular/core';

import DocsTemplate from 'src/app/@core/interfaces/DocTemplate';
import DocumentService from 'src/app/@core/services/document/document.service';
import { GlobalModel } from 'src/app/@core/models/global.model';
import { LocalizedStrings } from 'src/app/@core/services/i18n/i18n.interface';

@Component({
  selector: 'app-export-buttons',
  templateUrl: './export-buttons.component.html',
  styleUrls: ['./export-buttons.component.scss'],
})
export class ExportButtonsComponent {
  @Input()
  docsTemplate!: DocsTemplate;

  strings!: LocalizedStrings;

  constructor(private globals: GlobalModel, private documentsService: DocumentService) {
    this.globals.localizedStringsObservable.subscribe((strings) => (this.strings = strings));
  }

  exportCB2File(): void {
    this.documentsService.exportFile({ name: 'CaBr2', extensions: ['cb2'] }, this.docsTemplate);
  }

  exportPDFFile(): void {
    this.documentsService.exportFile({ name: 'PDF', extensions: ['pdf'] }, this.docsTemplate);
  }
}
