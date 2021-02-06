import {Component, OnInit} from '@angular/core';
import {descriptions} from '../../assets/descriptions.json';
import {GlobalModel} from '../@core/models/global.model';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss'],
  providers: [GlobalModel]
})
export class MenubarComponent implements OnInit {

  descriptions = descriptions;

  searchResults: string[] = ['foo', 'bar', 'baz'];

  constructor(
    public globals: GlobalModel,
  ) {
  }

  ngOnInit(): void {
    this.globals.header.documentTitle = 'Betriebsanweisungen nach EG Nr. 1272/2008';
    this.globals.header.organisation = 'für chemische Laboratorien des Campus Burghausen';
    this.globals.header.labCourse = 'Praktikum Anorganische Chemie';

    this.globals.humanAndEnvironmentDanger = [
      {content: 'Bei anhaltender Augenreizung ärztlichen Rat einholen. Funkenerzeugung und elektrische Aufladung vermeiden.', hover: false},
    ];

    this.globals.rulesOfConduct = [
      {content: 'Hautschutz und Schutzkleidung mit Schutzbrille tragen.', hover: false},
    ];

    this.globals.inCaseOfDanger = [
      {content: 'Nach Einatmen: An die frische Luft bringen. Sofort Arzt hinzuziehen.', hover: false},
      {content: 'Nach Hautkontakt: Sofort mit Wasser abwaschen. Kontaminierte Kleidung entfernen. Sofort Arzt hinzuziehen.', hover: false},
      {
        content: 'Nach Verschlucken: Mund mit Wasser spülen, Wasser trinken lassen. Kein Erbrechen auslösen. Nur bei Bewusstsein!',
        hover: false
      },
      {
        content: 'Nach Augenkontakt: Mit Wasser spülen. Falls vorhanden nach Möglichkeit Kontaktlinsen entfernen und weiter spülen. Sofort Augenarzt hinzuziehen.',
        hover: false
      },
    ];

    this.globals.disposal = [];
  }

  scroll(el: HTMLElement): void {
    el.scrollIntoView({behavior: 'smooth'});
  }

}
