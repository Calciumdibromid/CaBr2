import { combineLatest, Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { GlobalModel } from '../../models/global.model';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AlertService } from '../alertsnackbar/altersnackbar.service';
import { CaBr2Document } from '../loadSave/loadSave.model';
import { compareArrays } from '../../utils/compare';
import { DialogFilter } from '@tauri-apps/api/dialog';
import DocsTemplate from '../../interfaces/DocTemplate';
import { ILoadSaveService } from '../loadSave/loadSave.interface';
import { INativeService } from '../native/native.interface';
import { LocalizedStrings } from '../i18n/i18n.interface';
import Logger from '../../utils/logger';
import { YesNoDialogComponent } from 'src/app/components/yes-no-dialog/yes-no-dialog.component';

const logger = new Logger('documentService');

@Injectable()
export default class DocumentService {
  strings!: LocalizedStrings;

  private loadFilter: DialogFilter[] = [];
  private saveFilter: DialogFilter[] = [];

  constructor(
    private globals: GlobalModel,
    private nativeService: INativeService,
    private loadSaveService: ILoadSaveService,
    private alertService: AlertService,
    private dialog: MatDialog,
  ) {
    this.globals.localizedStringsObservable.subscribe((strings) => (this.strings = strings));

    this.loadSaveService.getAvailableDocumentTypes().subscribe(
      (types) => {
        logger.debug(types);
        this.loadFilter = types.load;
        this.saveFilter = types.save;
      },
      (err) => {
        logger.error('could not get document types:', err);
        this.alertService.error(this.strings.error.getAvailableDocumentTypes);
      },
    );
  }

  loadFile(): void {
    logger.trace('loadFile');
    this.nativeService
      .open({
        filters: this.loadFilter,
        multiple: false,
      })
      .pipe(first())
      .subscribe(
        (path) => {
          this.loadSaveService.loadDocument(path).subscribe(
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

  saveFile(type: DialogFilter, document: CaBr2Document): void {
    // check for development, should never occur in production
    if (this.saveFilter.includes(type)) {
      throw Error('unsupported file type');
    }

    // there should always be exact one fileextension
    const extension = type.extensions[0];

    this.nativeService
      .save({ filters: [type] })
      .pipe(
        switchMap((filename) => this.loadSaveService.saveDocument(extension, filename as string, document)),
        first(),
      )
      .subscribe(
        (res) => {
          logger.debug(res === undefined ? 'saving successful:' : 'saving not successful:', res);

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
          // fix for an error that occurs only on MS Windows (only needed with Tauri app)
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

  exportFile(type: DialogFilter, docsTemplate: DocsTemplate): void {
    logger.trace(`exportFile('${type}')`);
    this.modelToDocument()
      .pipe(first())
      .subscribe((doc) => {
        const unmodifiedStuff = this.checkUnmodified(doc, docsTemplate);
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

  private modelToDocument(): Observable<CaBr2Document> {
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

  private documentToModel(doc: CaBr2Document): void {
    this.globals.headerSubject.next(doc.header);
    this.globals.substanceDataSubject.next(doc.substanceData);
    this.globals.disposalSubject.next(doc.disposal);
    this.globals.humanAndEnvironmentDangerSubject.next(doc.humanAndEnvironmentDanger);
    this.globals.inCaseOfDangerSubject.next(doc.inCaseOfDanger);
    this.globals.rulesOfConductSubject.next(doc.rulesOfConduct);
  }

  /**
   * Returns `true` if the `CaBr2Document has some unchecked default values
   */
  private checkUnmodified(document: CaBr2Document, docsTemplate: DocsTemplate): string[] {
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
}
