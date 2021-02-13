import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {descriptions} from '../../assets/descriptions.json';
import {GlobalModel} from '../@core/models/global.model';
import {CaBr2Document} from '../@core/services/loadSave/loadSave.model';
import {LoadSaveService} from '../@core/services/loadSave/loadSave.service';
import logger from '../@core/utils/logger';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss'],
  providers: [GlobalModel],
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
      {
        content:
          'Bei anhaltender Augenreizung ärztlichen Rat einholen. Funkenerzeugung und elektrische Aufladung vermeiden.',
        hover: false,
      },
    ];

    this.globals.rulesOfConduct = [
      {
        content: 'Hautschutz und Schutzkleidung mit Schutzbrille tragen.',
        hover: false,
      },
    ];

    this.globals.inCaseOfDanger = [
      {
        content:
          'Nach Einatmen: An die frische Luft bringen. Sofort Arzt hinzuziehen.',
        hover: false,
      },
      {
        content:
          'Nach Hautkontakt: Sofort mit Wasser abwaschen. Kontaminierte Kleidung entfernen. Sofort Arzt hinzuziehen.',
        hover: false,
      },
      {
        content:
          'Nach Verschlucken: Mund mit Wasser spülen, Wasser trinken lassen. Kein Erbrechen auslösen. Nur bei Bewusstsein!',
        hover: false,
      },
      {
        content:
        // eslint-disable-next-line max-len
          'Nach Augenkontakt: Mit Wasser spülen. Falls vorhanden nach Möglichkeit Kontaktlinsen entfernen und weiter spülen. Sofort Augenarzt hinzuziehen.',
        hover: false,
      },
    ];

    this.globals.disposal = [];
  }

  scroll(el: HTMLElement): void {
    el.scrollIntoView({behavior: 'smooth'});
  }

  modelToDocument(): CaBr2Document {
    return {
      header: this.globals.header,
      substanceData: this.globals.substanceData,
      // TODO DELETE hover !!!!!!!!
      disposal: this.globals.disposal.map((element) => element.content),
      // TODO DELETE hover !!!!!!!!
      humanAndEnvironmentDanger: this.globals.humanAndEnvironmentDanger.map(
        (element) => element.content
      ),
      // TODO DELETE hover !!!!!!!!
      inCaseOfDanger: this.globals.inCaseOfDanger.map(
        (element) => element.content
      ),
      // TODO DELETE hover !!!!!!!!
      rulesOfConduct: this.globals.rulesOfConduct.map(
        (element) => element.content
      ),
    };
  }

  documentToModel(doc: CaBr2Document): void {
    this.globals.header = doc.header;
    this.globals.substanceData = doc.substanceData;
    // TODO DELETE hover !!!!!!!!
    this.globals.disposal = doc.disposal.map((element) => ({
      content: element,
      hover: false,
    }));
    // TODO DELETE hover !!!!!!!!
    this.globals.humanAndEnvironmentDanger = doc.humanAndEnvironmentDanger.map(
      (element) => ({content: element, hover: false})
    );
    // TODO DELETE hover !!!!!!!!
    this.globals.inCaseOfDanger = doc.inCaseOfDanger.map((element) => ({
      content: element,
      hover: false,
    }));
    // TODO DELETE hover !!!!!!!!
    this.globals.rulesOfConduct = doc.rulesOfConduct.map((element) => ({
      content: element,
      hover: false,
    }));
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

  onDarkModeSwitched({checked}: MatSlideToggleChange) {
    this.darkModeSwitched.emit(checked);
  }
}
