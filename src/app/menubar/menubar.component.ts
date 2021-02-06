import { Component, OnInit } from '@angular/core';
import { Header } from '../@core/interfaces/Header';
import ListInputSpecifcations from '../@core/interfaces/ListInputSpecifications';
import { descriptions } from '../../assets/descriptions.json'

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit {

  descriptions = descriptions;

  header: Header = {
    documentTitle: '',
    organisation: '',
    labCourse: '',
    name: '',
    place: '',
    assistant: '',
    preparation: '',
  };

  searchResults: string[] = ['foo', 'bar', 'baz'];

  humanAndEnvironmentDanger: ListInputSpecifcations[] = [
    { content: 'Bei anhaltender Augenreizung ärztlichen Rat einholen. Funkenerzeugung und elektrische Aufladung vermeiden.', hover: false },
  ];

  rulesOfConduct: ListInputSpecifcations[] = [
    { content: 'Hautschutz und Schutzkleidung mit Schutzbrille tragen.', hover: false },
  ];

  inCaseOfDanger: ListInputSpecifcations[] = [
    { content: 'Nach Einatmen: An die frische Luft bringen. Sofort Arzt hinzuziehen.', hover: false },
    { content: 'Nach Hautkontakt: Sofort mit Wasser abwaschen. Kontaminierte Kleidung entfernen. Sofort Arzt hinzuziehen.', hover: false },
    { content: 'Nach Verschlucken: Mund mit Wasser spülen, Wasser trinken lassen. Kein Erbrechen auslösen. Nur bei Bewusstsein!', hover: false },
    { content: 'Nach Augenkontakt: Mit Wasser spülen. Falls vorhanden nach Möglichkeit Kontaktlinsen entfernen und weiter spülen. Sofort Augenarzt hinzuziehen.', hover: false },
  ];

  disposal: ListInputSpecifcations[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

}
