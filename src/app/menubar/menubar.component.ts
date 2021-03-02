import { combineLatest, Observable } from 'rxjs';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { CaBr2Document } from '../@core/services/loadSave/loadSave.model';
import { ConfigModel } from '../@core/models/config.model';
import { descriptions } from '../../assets/descriptions.json';
import { GlobalModel } from '../@core/models/global.model';
import { LoadSaveService } from '../@core/services/loadSave/loadSave.service';
import Logger from '../@core/utils/logger';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TauriService } from '../@core/services/tauri/tauri.service';

const logger = new Logger('menubar');

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss'],
})
export class MenubarComponent implements OnInit {
  @Output()
  readonly darkModeSwitched = new EventEmitter<boolean>();

  descriptions = descriptions;

  private loadFilter: string[] = [];
  private saveFilter: string[] = [];

  constructor(
    public globals: GlobalModel,
    public config: ConfigModel,
    private loadSaveService: LoadSaveService,
    private tauriService: TauriService,
  ) {
    this.loadSaveService.getAvailableDocumentTypes().subscribe(
      (types) => {
        this.loadFilter = types.load;
        this.saveFilter = types.save;

        // fix to set cb2 type as default
        this.loadFilter.splice(this.loadFilter.indexOf('cb2'), 1);
        this.loadFilter.unshift('cb2');
      },
      (err) => logger.error(err),
    );
  }

  ngOnInit(): void {
    this.globals.headerSubject.next({
      assistant: '',
      documentTitle: 'Betriebsanweisungen nach EG Nr. 1272/2008',
      labCourse: 'Praktikum Anorganische Chemie',
      name: '',
      organisation: 'für chemische Laboratorien des Campus Burghausen',
      place: '',
      preparation: '',
    });

    this.globals.humanAndEnvironmentDangerSubject.next([
      'Bei anhaltender Augenreizung ärztlichen Rat einholen. Funkenerzeugung und elektrische Aufladung vermeiden.',
    ]);

    this.globals.rulesOfConductSubject.next(['Hautschutz und Schutzkleidung mit Schutzbrille tragen.']);

    this.globals.inCaseOfDangerSubject.next([
      'Nach Einatmen: An die frische Luft bringen. Sofort Arzt hinzuziehen.',
      'Nach Hautkontakt: Sofort mit Wasser abwaschen. Kontaminierte Kleidung entfernen. Sofort Arzt hinzuziehen.',
      'Nach Verschlucken: Mund mit Wasser spülen, Wasser trinken lassen. Kein Erbrechen auslösen. Nur bei Bewusstsein!',
      // eslint-disable-next-line max-len
      'Nach Augenkontakt: Mit Wasser spülen. Falls vorhanden nach Möglichkeit Kontaktlinsen entfernen und weiter spülen. Sofort Augenarzt hinzuziehen.',
    ]);

    this.globals.substanceDataSubject.next([]);
  }

  newDocument(): void {
    this.ngOnInit();
  }

  scroll(el: HTMLElement): void {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  modelToDocument(): Observable<CaBr2Document> {
    return combineLatest([
      this.globals.headerObservable,
      this.globals.substanceDataObservable,
      this.globals.disposalObservable,
      this.globals.humanAndEnvironmentDangerObservable,
      this.globals.inCaseOfDangerObservable,
      this.globals.rulesOfConductObservable,
    ]).pipe(
      map((value) => ({
        header: value[0],
        substanceData: value[1],
        disposal: value[2],
        humanAndEnvironmentDanger: value[3],
        inCaseOfDanger: value[4],
        rulesOfConduct: value[5],
      })),
    );
  }

  documentToModel(doc: CaBr2Document): void {
    this.globals.headerSubject.next(doc.header);
    this.globals.substanceDataSubject.next(doc.substanceData);
    this.globals.disposalSubject.next(doc.disposal);
    this.globals.humanAndEnvironmentDangerSubject.next(doc.humanAndEnvironmentDanger);
    this.globals.inCaseOfDangerSubject.next(doc.inCaseOfDanger);
    this.globals.rulesOfConductSubject.next(doc.rulesOfConduct);
  }

  loadFile(): void {
    logger.trace('loadFile');
    this.tauriService
      .open({
        filter: this.loadFilter.join(';'),
        multiple: false,
      })
      .subscribe((path) => {
        this.loadSaveService.loadDocument(path as string).subscribe(
          (res) => this.documentToModel(res),
          (err) => logger.error(err),
        );
      });
  }

  saveFile(type: string): void {
    logger.trace(`saveFile(${type})`);

    // check for development, should never occur in production
    if (this.saveFilter.indexOf(type) < 0) {
      throw Error('unsupported file type');
    }

    combineLatest([
      this.tauriService.save({ filter: type }),
      this.modelToDocument()
    ]).pipe(
      switchMap(value => this.loadSaveService.saveDocument(type, value[0] as string, value[1]))
    ).subscribe(
      (res) => logger.debug(res),
      (err) => {
        logger.error(err)
        // fix for an error that occurs only in windows
        if (err === 'Could not initialize COM.') {
          logger.debug('ty windows -.- | attempting fix')
          this.loadFile();
          this.exportPDF();
        }
      },
    );
  }

  exportPDF(): void {
    logger.trace('exportPDF()');
    combineLatest([
      this.tauriService.save({ filter: 'pdf' }),
      this.modelToDocument(),
    ]).pipe(
      switchMap(value => this.loadSaveService.saveDocument('pdf', value[0] as string, value[1]))
    ).subscribe(
      (res) => logger.debug(res),
      (err) => {
        logger.error(err)
        // fix for an error that occurs only in windows
        if (err === 'Could not initialize COM.') {
          logger.debug('ty windows -.- | attempting fix')
          this.loadFile();
          this.exportPDF();
        }
      },
    );
  }

  onDarkModeSwitched({ checked }: MatSlideToggleChange): void {
    this.darkModeSwitched.emit(checked);
  }
}
