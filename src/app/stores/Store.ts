import { Store } from 'pullstate';

interface CaBrStore {
    documentTitle: string,
    organisation: string,
    labCourse: string,
    name: string,
    place: string,
    assistant: string,
    preparation: string,

    humanAndEnvironmentDanger: Array<string>,
    rulesOfConduct: Array<string>,
    inCaseOfDanger: Array<string>,
    disposal: Array<string>,
}

export const UIStore = new Store<CaBrStore>({
    documentTitle: 'Betriebsanweisungen nach EG Nr. 1272/2008',
    organisation: 'für chemische Laboratorien des Campus Burghausen',
    labCourse: 'Praktikum Anorganische Chemie',
    name: '',
    place: '',
    assistant: '',
    preparation: 'Versuch X',

    humanAndEnvironmentDanger: ['Bei anhaltender Augenreizung ärztlichen Rat einholen. Funkenerzeugung und elektrische Aufladung vermeiden.', 'Hautkontakt mit der Nickellösung vermeiden und auf verschüttete Tropfen achten!'],
    rulesOfConduct: ['Hautschutz und Schutzkleidung mit Schutzbrille tragen.'],
    inCaseOfDanger: ['Nach Einatmen: An die frische Luft bringen. Sofort Arzt hinzuziehen.', 'Nach Hautkontakt: Sofort mit Wasser abwaschen. Kontaminierte Kleidung entfernen. Sofort Arzt hinzuziehen.', 'Nach Verschlucken: Mund mit Wasser spülen, Wasser trinken lassen. Kein Erbrechen auslösen. Nur bei Bewusstsein!', 'Nach Augenkontakt: Mit Wasser spülen. Falls vorhanden nach Möglichkeit Kontaktlinsen entfernen und weiter spülen. Sofort Augenarzt hinzuziehen.'],
    disposal: [],
});

export default UIStore;
