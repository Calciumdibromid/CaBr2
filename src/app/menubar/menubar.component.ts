import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { descriptions } from '../../assets/descriptions.json';

import { GlobalModel } from '../@core/models/global.model';
import { CaBr2Document } from '../@core/services/loadSave/loadSave.model';
import { LoadSaveService } from '../@core/services/loadSave/loadSave.service';
import logger from '../@core/utils/logger';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit {
  @Output()
  readonly darkModeSwitched = new EventEmitter<boolean>();

  descriptions = descriptions;

  constructor(
    public globals: GlobalModel,
    private loadSaveService: LoadSaveService
  ) {}

  ngOnInit(): void {
    this.globals.header.documentTitle =
      'Betriebsanweisungen nach EG Nr. 1272/2008';
    this.globals.header.organisation =
      'für chemische Laboratorien des Campus Burghausen';
    this.globals.header.labCourse = 'Praktikum Anorganische Chemie';

    this.globals.humanAndEnvironmentDanger = [
      'Bei anhaltender Augenreizung ärztlichen Rat einholen. Funkenerzeugung und elektrische Aufladung vermeiden.',
    ];

    this.globals.rulesOfConduct = [
      'Hautschutz und Schutzkleidung mit Schutzbrille tragen.',
    ];

    this.globals.inCaseOfDanger = [
      'Nach Einatmen: An die frische Luft bringen. Sofort Arzt hinzuziehen.',
      'Nach Hautkontakt: Sofort mit Wasser abwaschen. Kontaminierte Kleidung entfernen. Sofort Arzt hinzuziehen.',
      'Nach Verschlucken: Mund mit Wasser spülen, Wasser trinken lassen. Kein Erbrechen auslösen. Nur bei Bewusstsein!',
      // eslint-disable-next-line max-len
      'Nach Augenkontakt: Mit Wasser spülen. Falls vorhanden nach Möglichkeit Kontaktlinsen entfernen und weiter spülen. Sofort Augenarzt hinzuziehen.',
    ];

    this.globals.disposal = [];
  }

  scroll(el: HTMLElement): void {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  modelToDocument(): CaBr2Document {
    return {
      header: this.globals.header,
      substanceData: this.globals.substanceData,
      disposal: this.globals.disposal,
      humanAndEnvironmentDanger: this.globals.humanAndEnvironmentDanger,
      inCaseOfDanger: this.globals.inCaseOfDanger,
      rulesOfConduct: this.globals.rulesOfConduct,
    };
  }

  documentToModel(doc: CaBr2Document): void {
    this.globals.header = doc.header;
    this.globals.substanceData = doc.substanceData;
    this.globals.disposal = doc.disposal;
    this.globals.humanAndEnvironmentDanger = doc.humanAndEnvironmentDanger;
    this.globals.inCaseOfDanger = doc.inCaseOfDanger;
    this.globals.rulesOfConduct = doc.rulesOfConduct;
  }

  loadFile(): void {
    this.loadSaveService.loadDocument('/tmp/test.cb2').subscribe(
      (res) => this.documentToModel(res),
      (err) => logger.error(err)
    );
  }

  saveFile(): void {
    this.loadSaveService
      .saveDocument('cb2', '/tmp/test.cb2', this.modelToDocument())
      .subscribe(
        (res) => logger.debug(res),
        (err) => logger.error(err)
      );
  }

  exportPDF(): void {
    this.loadSaveService
      .saveDocument('pdf', '/tmp/test.pdf', this.modelToDocument())
      .subscribe(
        (res) => logger.debug(res),
        (err) => logger.error(err)
      );
  }

  onDarkModeSwitched({ checked }: MatSlideToggleChange): void {
    this.darkModeSwitched.emit(checked);
  }
}
