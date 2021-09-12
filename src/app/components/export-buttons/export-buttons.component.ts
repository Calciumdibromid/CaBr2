import { Component, Input } from '@angular/core';

import DocsTemplate from 'src/app/@core/interfaces/DocTemplate';
import DocumentService from 'src/app/@core/services/document/document.service';

@Component({
  selector: 'app-export-buttons',
  templateUrl: './export-buttons.component.html',
  styleUrls: ['./export-buttons.component.scss'],
})
export class ExportButtonsComponent {
  @Input()
  docsTemplate!: DocsTemplate;

  constructor(private documentsService: DocumentService) {}

  exportCB2File(): void {
    this.documentsService.exportFile({ name: 'CaBr2', extensions: ['cb2'] }, this.docsTemplate);
  }

  exportPDFFile(): void {
    this.documentsService.exportFile({ name: 'PDF', extensions: ['pdf'] }, this.docsTemplate);
  }
}
