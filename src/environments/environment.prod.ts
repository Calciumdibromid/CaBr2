import { ConfigService } from 'src/app/@core/services/config/config.service';
import { I18nService } from 'src/app/@core/services/i18n/i18n.service';
import { LoadSaveService } from 'src/app/@core/services/loadSave/loadSave.service';
import { ProviderService } from 'src/app/@core/services/provider/provider.service';

export const environment = {
  production: true,
  serviceProvider: {
    i18nService: I18nService,
    configService: ConfigService,
    loadSaveService: LoadSaveService,
    providerService: ProviderService,
  },
};
