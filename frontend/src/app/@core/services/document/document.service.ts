import { combineLatest, Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { DialogFilter } from '@tauri-apps/api/dialog';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { translate } from '@ngneat/transloco';

import DocsTemplate, { Header } from '../../interfaces/DocTemplate';
import { FillHeader, HeaderState } from '../../states/header.state';
import { AlertService } from '../alertsnackbar/alertsnackbar.service';
import { CaBr2Document } from '../loadSave/loadSave.model';
import { compareArrays } from '../../utils/compare';
import { DisposalState } from '../../states/disposal.state';
import { FillSentence as FillDisposalSentence } from '../../actions/disposal.actions';
import { FillSentence as FillHumanAndEnvironmentDangerSentence } from '../../actions/human-and-environment-danger.actions';
import { FillSentence as FillInCaseOfDangerSentence } from '../../actions/in-case-of-danger.actions';
import { FillSentence as FillRulesOfConductSentence } from '../../actions/rules-of-conduct-acitons';
import { FillSubstanceData } from '../../states/substance-data.state';
import { HumanAndEnvironmentDangerState } from '../../states/human-and-environment-danger.state';
import { ILoadSaveService } from '../loadSave/loadSave.interface';
import { INativeService } from '../native/native.interface';
import { InCaseOfDangerState } from '../../states/incase-of-danger.state';
import Logger from '../../utils/logger';
import { RulesOfConductState } from '../../states/rules-of-conduct.state';
import { SubstanceData } from '../../models/substances.model';
import { YesNoDialogComponent } from '../../../components/yes-no-dialog/yes-no-dialog.component';

const logger = new Logger('documentService');

@Injectable()
export default class DocumentService {
  @Select(HeaderState.header) private header$!: Observable<Header>;

  @Select((state: any) => state.substance_data.substanceData) private substanceData$!: Observable<SubstanceData[]>;

  @Select(DisposalState.elements) private disposal$!: Observable<string[]>;

  @Select(HumanAndEnvironmentDangerState.elements) private humanAndEnvironmentDanger$!: Observable<string[]>;

  @Select(InCaseOfDangerState.elements) private inCaseOfDanger$!: Observable<string[]>;

  @Select(RulesOfConductState.elements) private rulesConduct$!: Observable<string[]>;

  private loadFilter: DialogFilter[] = [];

  private saveFilter: DialogFilter[] = [];

  constructor(
    private store: Store,
    private nativeService: INativeService,
    private loadSaveService: ILoadSaveService,
    private alertService: AlertService,
    private dialog: MatDialog,
  ) {
    this.loadSaveService.getAvailableDocumentTypes().subscribe({
      next: (types) => {
        logger.debug(types);
        this.loadFilter = types.load;
        this.saveFilter = types.save;
      },
      error: (err) => {
        logger.error('could not get document types:', err);
        this.alertService.error(translate('error.getAvailableDocumentTypes'));
      },
    });
  }

  loadFile(): void {
    logger.trace('loadFile');
    this.nativeService
      .open({
        filters: this.loadFilter,
        multiple: false,
      })
      .pipe(first())
      .subscribe({
        next: (path) => {
          // this is intentional, because we have to handle both errors independently
          this.loadSaveService.loadDocument(path).subscribe({
            next: (res) => {
              this.documentToModel(res);
            },
            error: (err) => {
              logger.error('loading file failed:', err);
              this.alertService.error(translate('error.loadFile'));
            },
          });
        },
        error: (err) => logger.trace('open dialog returned error:', err),
      });
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
      .subscribe({
        next: (res) => {
          logger.debug(res === null ? 'saving successful:' : 'saving not successful:', res);

          switch (extension) {
            case 'pdf':
              this.alertService.success(translate('success.exportPDF'));
              break;

            default:
              this.alertService.success(translate('success.saveFile'));
              break;
          }
        },
        error: (err) => {
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
              this.alertService.error(translate('error.exportPDF'));
              break;

            default:
              this.alertService.error(translate('error.saveFile'));
              break;
          }
        },
      });
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
                title: translate('dialogs.unchangedValues.title'),
                content: translate('dialogs.unchangedValues.content'),
                listItems: unmodifiedStuff,
                footerText: translate('dialogs.unchangedValues.footer'),
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
      this.header$,
      this.substanceData$,
      this.disposal$,
      this.humanAndEnvironmentDanger$,
      this.inCaseOfDanger$,
      this.rulesConduct$,
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
    this.store.dispatch([
      new FillHeader(doc.header),
      new FillSubstanceData(doc.substanceData),
      new FillDisposalSentence(doc.disposal),
      new FillHumanAndEnvironmentDangerSentence(doc.humanAndEnvironmentDanger),
      new FillInCaseOfDangerSentence(doc.inCaseOfDanger),
      new FillRulesOfConductSentence(doc.rulesOfConduct),
    ]);
  }

  /**
   * Returns `true` if the `CaBr2Document has some unchecked default values
   */
  private checkUnmodified(document: CaBr2Document, docsTemplate: DocsTemplate): string[] {
    const unmodified: string[] = [];
    for (const substance of document.substanceData) {
      if (!substance.checked) {
        unmodified.push(substance.name.modifiedData ?? substance.name.originalData);
      }
    }
    for (const section of [
      [
        document.humanAndEnvironmentDanger,
        docsTemplate.humanAndEnvironmentDanger,
        [translate('descriptions.humanAndEnvironmentDangerShort')],
      ],
      [document.rulesOfConduct, docsTemplate.rulesOfConduct, [translate('descriptions.rulesOfConductShort')]],
      [document.inCaseOfDanger, docsTemplate.inCaseOfDanger, [translate('descriptions.inCaseOfDangerShort')]],
      [document.disposal, docsTemplate.disposal, [translate('descriptions.disposalShort')]],
    ]) {
      if (compareArrays(section[0], section[1])) {
        unmodified.push(section[2][0] as string);
      }
    }
    return unmodified;
  }
}
