import { InjectionToken } from '@angular/core';
import { WatsonDataProviderService } from './watson-data-provider.service';

export const WATSON_DATA_PROVIDER_TOKEN = new InjectionToken<WatsonDataProviderService>('WatsonDataProviderToken')