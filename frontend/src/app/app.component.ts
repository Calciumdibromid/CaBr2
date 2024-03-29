import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store';
import { Component, HostBinding, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { first, Observable, Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { TranslocoService } from '@ngneat/transloco';

import { AcceptConsent, LoadConfig, ToggleDarkTheme } from './@core/states/config.state';
import { Config } from './@core/interfaces/config.interface';
import { ConsentComponent } from './components/consent/consent.component';
import { initializeCustomIcons } from './customIcons';
import { LoadGHSSymbols } from './@core/states/ghs-symbols.state';
import packageInfo from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @Select((store: any) => store.config) config$!: Observable<Config>;

  name = packageInfo.name;

  version = packageInfo.version;

  darkTheme = false;

  dispatchSubscription!: Subscription;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly renderer: Renderer2,
    private readonly dialog: MatDialog,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,

    private readonly translocoService: TranslocoService,
    private readonly store: Store,
    private readonly actions$: Actions,
  ) {
    initializeCustomIcons(this.matIconRegistry, this.domSanitizer);
  }

  @HostBinding('class')
  get themeMode(): string {
    return this.darkTheme ? 'theme-dark' : 'theme-light';
  }

  ngOnInit(): void {
    this.store
      .dispatch([new LoadConfig(), new LoadGHSSymbols()])
      .pipe(first())
      .subscribe(() => {
        this.store
          .select((store: any) => store.config)
          .subscribe((config: Config) => {
            this.switchMode(config.darkTheme);
            this.translocoService.setActiveLang(config.language);
            if (!config.acceptedConsent) {
              this.dialog
                .open(ConsentComponent, {
                  data: {
                    duration: 5,
                  },
                  disableClose: true,
                })
                .afterClosed()
                .subscribe(() => {
                  this.store.dispatch(new AcceptConsent());
                });
            }
          });
      });

    this.dispatchSubscription = this.actions$
      .pipe(ofActionDispatched(ToggleDarkTheme))
      .subscribe((action: ToggleDarkTheme) => {
        this.switchMode(action.darkTheme);
      });
  }

  ngOnDestroy(): void {
    this.dispatchSubscription.unsubscribe();
  }

  switchMode(isDarkMode: boolean): void {
    this.darkTheme = isDarkMode;
    const hostClass = isDarkMode ? 'theme-dark' : 'theme-light';
    this.renderer.setAttribute(this.document.body, 'class', hostClass);
  }
}
