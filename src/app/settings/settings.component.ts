import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';

import { ConfigModel, configObservable } from '../@core/models/config.model';
import { II18nService, LocalizedStrings, LocalizedStringsHeader } from '../@core/services/i18n/i18n.interface';
import { GlobalModel } from '../@core/models/global.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  readonly darkModeSwitched = new EventEmitter<boolean>();

  strings!: LocalizedStrings;
  languages!: LocalizedStringsHeader[];
  form: FormGroup;
  subscriptions: Subscription[] = [];

  private config!: ConfigModel;

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    private globals: GlobalModel,
    private i18nService: II18nService,
    private formBuilder: FormBuilder,
  ) {
    this.globals.localizedStringsObservable.subscribe((strings) => (this.strings = strings));
    this.form = this.formBuilder.group({
      language: '',
      theme: '',
    });
  }

  get f(): { [p: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.i18nService.getAvailableLanguages().subscribe((languages) => (this.languages = languages)),

      configObservable.subscribe((config) => {
        this.form.patchValue(
          {
            language: config.globalSection.language,
            theme: config.globalSection.darkTheme,
          },
          { emitEvent: false },
        );
        this.config = config;
      }),

      this.f.theme.valueChanges.subscribe((change) => this.darkModeSwitched.emit(change)),

      this.f.language.valueChanges.subscribe((change) => {
        this.config.setLanguage(change);
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onDarkModeSwitched({ checked }: MatSlideToggleChange): void {
    this.darkModeSwitched.emit(checked);
  }
}
