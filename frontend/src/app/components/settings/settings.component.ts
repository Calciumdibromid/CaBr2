import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';

import { ChangeLanguage, ToggleDarkTheme } from 'src/app/@core/states/config.state';
import { AvailableLanguage } from '../../@core/services/i18n/i18n.interface';
import { TranslocoService } from '@ngneat/transloco';

type SettingsForm = {
  language: FormControl<string>;
  theme: FormControl<string>;
};

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  langs!: AvailableLanguage[];

  form!: FormGroup<SettingsForm>;

  private destroyed$ = new Subject<void>();

  constructor(
    public readonly dialogRef: MatDialogRef<SettingsComponent>,
    private readonly translocoService: TranslocoService,
    private readonly formBuilder: NonNullableFormBuilder,
    private readonly store: Store,
  ) {}

  get f(): { [p: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group<SettingsForm>({
      language: this.formBuilder.control(''),
      theme: this.formBuilder.control(''),
    });

    this.langs = this.translocoService.getAvailableLangs() as AvailableLanguage[];

    this.store
      .selectOnce((state: any) => state.config)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((config) => {
        this.form.patchValue(
          {
            language: config.language,
            theme: config.darkTheme,
          },
          { emitEvent: false },
        );
      });

    this.f.theme.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((change) => this.store.dispatch(new ToggleDarkTheme(change)));

    this.f.language.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((change) => {
      this.store.dispatch(new ChangeLanguage(change));
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
