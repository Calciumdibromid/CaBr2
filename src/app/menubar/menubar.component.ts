import { combineLatest, Observable } from 'rxjs';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { first, map, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { DialogFilter, TauriService } from '../@core/services/tauri/tauri.service';
import { AlertService } from '../@core/services/alertsnackbar/altersnackbar.service';
import { CaBr2Document } from '../@core/services/loadSave/loadSave.model';
import { compareArrays } from '../@core/utils/compare';
import { ConfigService } from '../@core/services/config/config.service';
import { docsTemplate } from '../../assets/docsTemplate.json';
import { GlobalModel } from '../@core/models/global.model';
import { LoadSaveService } from '../@core/services/loadSave/loadSave.service';
import { LocalizedStrings } from '../@core/services/i18n/i18n.service';
import Logger from '../@core/utils/logger';
import { ManualComponent } from '../manual/manual.component';
import { ReportBugComponent } from '../report-bug/report-bug.component';
import { SettingsComponent } from '../settings/settings.component';
import { YesNoDialogComponent } from '../yes-no-dialog/yes-no-dialog.component';

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

  private loadFilter: DialogFilter[] = [];
  private saveFilter: DialogFilter[] = [];

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
      },
      (err) => {
        logger.error('could not get document types:', err);
        this.alertService.error(this.strings.error.getAvailableDocumentTypes);
      },
    );
  }

  ngOnInit(): void {
    this.globals.headerSubject.next({ ...docsTemplate.header });
    this.globals.humanAndEnvironmentDangerSubject.next(docsTemplate.humanAndEnvironmentDanger);
    this.globals.rulesOfConductSubject.next(docsTemplate.rulesOfConduct);
    this.globals.inCaseOfDangerSubject.next(docsTemplate.inCaseOfDanger);
    this.globals.disposalSubject.next(docsTemplate.disposal);

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
        filters: this.loadFilter,
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

  /**
   * Returns `true` if the `CaBr2Document has some unchecked default values
   */
  checkUnmodified(document: CaBr2Document): string[] {
    const unmodified = [];
    for (const substance of document.substanceData) {
      if (!substance.checked) {
        unmodified.push(substance.name.modifiedData ?? substance.name.originalData);
      }
    }
    for (const section of [
      [
        document.humanAndEnvironmentDanger,
        docsTemplate.humanAndEnvironmentDanger,
        [this.strings.descriptions.humanAndEnvironmentDangerShort],
      ],
      [document.rulesOfConduct, docsTemplate.rulesOfConduct, [this.strings.descriptions.rulesOfConductShort]],
      [document.inCaseOfDanger, docsTemplate.inCaseOfDanger, [this.strings.descriptions.inCaseOfDangerShort]],
      [document.disposal, docsTemplate.disposal, [this.strings.descriptions.disposalShort]],
    ]) {
      if (compareArrays(section[0], section[1])) {
        unmodified.push(section[2][0]);
      }
    }
    return unmodified;
  }

  saveFile(type: DialogFilter, document: CaBr2Document): void {
    // check for development, should never occur in production
    if (this.saveFilter.includes(type)) {
      throw Error('unsupported file type');
    }

    // there should always be exact one fileextension
    const extension = type.extensions[0];

    this.tauriService
      .save({ filters: [type] })
      .pipe(
        switchMap((filename) => this.loadSaveService.saveDocument(extension, filename as string, document)),
        first(),
      )
      .subscribe(
        (res) => {
          logger.debug(res);

          switch (extension) {
            case 'pdf':
              this.alertService.success(this.strings.success.exportPDF);
              break;

            default:
              this.alertService.success(this.strings.success.saveFile);
              break;
          }
        },
        (err) => {
          logger.error(err);
          // fix for an error that occurs only in windows
          if (err === 'Could not initialize COM.') {
            logger.debug('ty windows -.- | attempting fix');
            this.loadFile();
            this.saveFile(type, document);
            return;
          }

          switch (extension) {
            case 'pdf':
              this.alertService.error(this.strings.error.exportPDF);
              break;

            default:
              this.alertService.error(this.strings.error.saveFile);
              break;
          }
        },
      );
  }

  openManualDialog(): void {
    this.configService.getPromptHtml('gettingStarted').subscribe((html) => {
      this.dialog.open(ManualComponent, {
        data: {
          content: html,
        },
      });
    });
  }

  openSettingsDialog(): void {
    const dialogRef = this.dialog.open(SettingsComponent);

    dialogRef.componentInstance.darkModeSwitched.subscribe((checked: boolean) => {
      this.darkModeSwitched.emit(checked);
    });
  }

  exportCB2File(): void {
    this.exportFile({ name: 'CaBr2', extensions: ['cb2'] });
  }

  exportPDFFile(): void {
    this.exportFile({ name: 'PDF', extensions: ['pdf'] });
  }

  private exportFile(type: DialogFilter): void {
    logger.trace(`exportFile('${type}')`);
    this.modelToDocument()
      .pipe(first())
      .subscribe((doc) => {
        const unmodifiedStuff = this.checkUnmodified(doc);
        if (unmodifiedStuff) {
          this.dialog
            .open(YesNoDialogComponent, {
              data: {
                iconName: 'warning',
                title: this.strings.dialogs.unchangedValues.title,
                content: this.strings.dialogs.unchangedValues.content,
                listItems: unmodifiedStuff,
                footerText: this.strings.dialogs.unchangedValues.footer,
              },
              panelClass: ['unselectable', 'undragable'],
            })
            .afterClosed()
            .pipe(first())
            .subscribe((res) => (res ? this.saveFile(type, doc) : undefined));
        } else {
          this.saveFile(type, doc);
        }
      });
  }
}
