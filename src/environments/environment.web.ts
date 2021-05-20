// this environment is use when built with the "--configuration web" flag

import { BrowserService } from 'src/app/@core/services/native/web/browser.service';
import { ConfigWebService } from 'src/app/@core/services/config/web/config.service';
import { I18nWebService } from 'src/app/@core/services/i18n/web/i18n.service';
import { LoadSaveService } from 'src/app/@core/services/loadSave/web/loadSave.service';
import { ProviderService } from 'src/app/@core/services/provider/web/provider.service';

export const environment = {
  production: true,
  serviceProvider: {
    i18nService: I18nWebService,
    configService: ConfigWebService,
    loadSaveService: LoadSaveService,
    nativeService: BrowserService,
    providerService: ProviderService,
  },
};
