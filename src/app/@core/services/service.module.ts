import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { BrowserService } from './native/web/browser.service';
import { ConfigService } from './config/config.service';
import { ConfigWebService } from './config/web/config.service';
import DocumentService from './document/document.service';
import { environment } from 'src/environments/environment';
import { GlobalModel } from '../models/global.model';
import { I18nService } from './i18n/i18n.service';
import { I18nWebService } from './i18n/web/i18n.service';
import { IConfigService } from './config/config.interface';
import { II18nService } from './i18n/i18n.interface';
import { ILoadSaveService } from './loadSave/loadSave.interface';
import { INativeService } from './native/native.interface';
import { IProviderService } from './provider/provider.interface';
import { LoadSaveService } from './loadSave/loadSave.service';
import { ProviderService } from './provider/provider.service';
import { TauriService } from './native/tauri.service';
import { LoadSaveService as WebLoadSaveService } from './loadSave/web/loadSave.service';
import { ProviderService as WebProviderService } from './provider/web/provider.service';

const configFactory = (nativeService: INativeService): IConfigService => {
  if (environment.web) {
    return new ConfigWebService();
  } else {
    return new ConfigService(nativeService);
  }
};

const i18nFactory = (
  nativeService: INativeService,
  http: HttpClient,
): II18nService => {
  if (environment.web) {
    return new I18nWebService(http);
  } else {
    return new I18nService(nativeService);
  }
};

const loadSaveFactory = (nativeService: INativeService): ILoadSaveService => {
  if (environment.web) {
    return new WebLoadSaveService();
  } else {
    return new LoadSaveService(nativeService);
  }
};

const nativeFactory = (): INativeService => {
  if (environment.web) {
    return new BrowserService();
  } else {
    return new TauriService();
  }
};

const providerFactory = (nativeService: INativeService, globals: GlobalModel): IProviderService => {
  if (environment.web) {
    return new WebProviderService();
  } else {
    return new ProviderService(nativeService, globals);
  }
};
@NgModule({
  providers: [
    {
      provide: IConfigService,
      useFactory: configFactory,
      deps: [INativeService],
    },
    {
      provide: II18nService,
      useFactory: i18nFactory,
      deps: [INativeService, HttpClient],
    },
    {
      provide: ILoadSaveService,
      useFactory: loadSaveFactory,
      deps: [INativeService],
    },
    {
      provide: INativeService,
      useFactory: nativeFactory,
    },
    {
      provide: IProviderService,
      useFactory: providerFactory,
      deps: [INativeService, GlobalModel],
    },
    DocumentService,
  ],
})
export class ServiceModule {}
