import localeDe from '@angular/common/locales/de';
import {
  ApplicationConfig,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  SIDEBAR_ITEMS_TOKEN,
  WATSON_DATA_PROVIDER_TOKEN,
  WatsonStoreService,
} from 'shared';
import { navItems, routes } from './app.routes';

registerLocaleData(localeDe);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    { provide: WATSON_DATA_PROVIDER_TOKEN, useClass: WatsonStoreService },
    {
      provide: LOCALE_ID,
      useValue: navigator.language,
    },
    { provide: SIDEBAR_ITEMS_TOKEN, useValue: navItems },
  ],
};
