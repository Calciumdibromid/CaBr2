import { AbstractControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';

import { ChangeLanguage, ToggleDarkTheme } from 'src/app/@core/states/config.state';
import { AvailableLanguage } from '../../@core/services/i18n/i18n.interface';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  langs!: AvailableLanguage[];

  form!: UntypedFormGroup;

  subscriptions: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    private translocoService: TranslocoService,
    private formBuilder: UntypedFormBuilder,
    private store: Store,
  ) {}

  get f(): { [p: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      language: '',
      theme: '',
    });

    this.langs = this.translocoService.getAvailableLangs() as AvailableLanguage[];

    this.store
      .selectOnce((state: any) => state.config)
      .subscribe((config) => {
        this.form.patchValue(
          {
            language: config.language,
            theme: config.darkTheme,
          },
          { emitEvent: false },
        );
      });

    this.subscriptions.push(
      this.f.theme.valueChanges.subscribe((change) => this.store.dispatch(new ToggleDarkTheme(change))),

      this.f.language.valueChanges.subscribe((change) => {
        this.store.dispatch(new ChangeLanguage(change));
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
