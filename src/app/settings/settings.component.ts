import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { I18nService, LocalizedStrings, LocalizedStringsHeader } from '../@core/services/i18n/i18n.service';
import { AlertService } from '../@core/services/alertsnackbar/altersnackbar.service';
import { ConfigModel } from '../@core/models/config.model';
import { ConfigService } from '../@core/services/config/config.service';
import { GlobalModel } from '../@core/models/global.model';
import Logger from '../@core/utils/logger';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';

const logger = new Logger('settings');

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

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    private globals: GlobalModel,
    private config: ConfigModel,
    private i18nService: I18nService,
    private configService: ConfigService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
  ) {
    this.globals.localizedStringsObservable.subscribe((strings) => (this.strings = strings));
    this.form = this.formBuilder.group({
      language: '',
      theme: '',
    });
  }

  ngOnInit(): void {
    const languageSubscription = this.i18nService.getAvailableLanguages().subscribe((languages) => {
      this.languages = languages;
    });

    const configSubscription = this.configService.getConfig().subscribe((config) => {
      this.form.patchValue({
        language: config.global.language,
        theme: config.global.darkTheme,
      });
    });

    const darkModeSubscription = this.form
      .get('theme')
      ?.valueChanges.subscribe((change) => this.darkModeSwitched.emit(change));

    const languageControlSubscription = this.form.get('language')?.valueChanges.subscribe((change) => {
      this.config.global.language = change;
      this.configService.saveConfig(this.config).subscribe(
        () => logger.info('config saved'),
        (err) => {
          logger.error('saving config failed:', err);
          this.alertService.error(this.strings.error.configSave);
        },
      );
    });

    if (darkModeSubscription) {
      this.subscriptions.push(darkModeSubscription);
    }

    if (languageControlSubscription) {
      this.subscriptions.push(languageControlSubscription);
    }

    this.subscriptions.push(languageSubscription, configSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onDarkModeSwitched({ checked }: MatSlideToggleChange): void {
    this.darkModeSwitched.emit(checked);
  }
}
