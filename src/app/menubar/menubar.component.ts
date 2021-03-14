import { combineLatest, Observable } from 'rxjs';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { first, map, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { AlertService } from '../@core/services/alertsnackbar/altersnackbar.service';
import { CaBr2Document } from '../@core/services/loadSave/loadSave.model';
import { ConfigService } from '../@core/services/config/config.service';
import { ConsentComponent } from '../consent/consent.component';
import { docsTemplate } from '../../assets/docsTemplate.json';
import { GlobalModel } from '../@core/models/global.model';
import { LoadSaveService } from '../@core/services/loadSave/loadSave.service';
import { LocalizedStrings } from '../@core/services/i18n/i18n.service';
import Logger from '../@core/utils/logger';
import { ManualComponent } from '../manual/manual.component';
import { ReportBugComponent } from '../report-bug/report-bug.component';
import { SettingsComponent } from '../settings/settings.component';
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

  strings!: LocalizedStrings;

  programmVersion!: string;

  private loadFilter: string[] = [];
  private saveFilter: string[] = [];

  constructor(
    public globals: GlobalModel,
    private loadSaveService: LoadSaveService,
    private tauriService: TauriService,
    private alertService: AlertService,
    private configService: ConfigService,
    private dialog: MatDialog,
  ) {
    this.globals.localizedStringsObservable.subscribe((strings) => (this.strings = strings));

    this.loadSaveService.getAvailableDocumentTypes().subscribe(
      (types) => {
        this.loadFilter = types.load;
        this.saveFilter = types.save;

        // fix to set cb2 type as default
        this.loadFilter.splice(this.loadFilter.indexOf('cb2'), 1);
        this.loadFilter.unshift('cb2');
      },
      (err) => {
        logger.error('could not get document types:', err);
        this.alertService.error(this.strings.error.getAvailableDocumentTypes);
      },
    );
  }

  ngOnInit(): void {
    this.globals.headerSubject.next({
      assistant: docsTemplate.assistant,
      documentTitle: docsTemplate.documentTitle,
      labCourse: docsTemplate.labCourse,
      name: docsTemplate.name,
      organisation: docsTemplate.organisation,
      place: docsTemplate.place,
      preparation: docsTemplate.preparation,
    });

    this.globals.humanAndEnvironmentDangerSubject.next(docsTemplate.humanAndEnvironmentDangerSubject);

    this.globals.rulesOfConductSubject.next(docsTemplate.rulesOfConductSubject);

    this.globals.inCaseOfDangerSubject.next(docsTemplate.inCaseOfDangerSubject);

    this.globals.substanceDataSubject.next([]);

    this.configService
      .getProgramVersion()
      .pipe(first())
      .subscribe((version) => (this.programmVersion = version));
  }

  newDocument(): void {
    this.ngOnInit();
  }

  scroll(el: HTMLElement): void {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  openMail(): void {
    this.dialog.open(ReportBugComponent);
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
      .pipe(first())
      .subscribe(
        (path) => {
          this.loadSaveService.loadDocument(path as string).subscribe(
            (res) => this.documentToModel(res),
            (err) => {
              logger.error('loading file failed:', err);
              this.alertService.error(this.strings.error.loadFile);
            },
          );
        },
        (err) => logger.trace('open dialog returned error:', err),
      );
  }

  saveFile(type: string): void {
    logger.trace(`saveFile(${type})`);

    // check for development, should never occur in production
    if (this.saveFilter.indexOf(type) < 0) {
      throw Error('unsupported file type');
    }

    combineLatest([this.tauriService.save({ filter: type }), this.modelToDocument()])
      .pipe(
        switchMap((value) => this.loadSaveService.saveDocument(type, value[0] as string, value[1])),
        first(),
      )
      .subscribe(
        (res) => {
          logger.debug(res);
          this.alertService.success(this.strings.success.saveFile);
        },
        (err) => {
          logger.error(err);
          // fix for an error that occurs only in windows
          if (err === 'Could not initialize COM.') {
            logger.debug('ty windows -.- | attempting fix');
            this.loadFile();
            this.saveFile(type);
            return;
          }
          this.alertService.error(this.strings.error.saveFile);
        },
      );
  }

  exportPDF(): void {
    logger.trace('exportPDF()');
    combineLatest([this.tauriService.save({ filter: 'pdf' }), this.modelToDocument()])
      .pipe(
        switchMap((value) => this.loadSaveService.saveDocument('pdf', value[0] as string, value[1])),
        first(),
      )
      .subscribe(
        (res) => {
          logger.debug(res);
          this.alertService.success(this.strings.success.exportPDF);
        },
        (err) => {
          logger.error(err);
          // fix for an error that occurs only in windows
          if (err === 'Could not initialize COM.') {
            logger.debug('ty windows -.- | attempting fix');
            this.loadFile();
            this.exportPDF();
            return;
          }
          this.alertService.error(this.strings.error.exportPDF);
        },
      );
  }

  openManualDialog(): void {
    this.dialog.open(ManualComponent, {
      data: { content: 'foo' },
    });
  }

  openSettingsDialog(): void {
    const dialogRef = this.dialog.open(SettingsComponent);

    dialogRef.componentInstance.darkModeSwitched.subscribe((checked: boolean) => {
      this.darkModeSwitched.emit(checked);
    });
  }

  openConsentDialog(): void {
    this.dialog.open(ConsentComponent, {
      data: {
        duration: 0,
      },
      disableClose: true,
    });
  }
}
