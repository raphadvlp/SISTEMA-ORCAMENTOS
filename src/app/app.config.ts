import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PoHttpRequestModule } from '@po-ui/ng-components';
import {
  // responseTransformInterceptor,
  responseTransformInterceptorContas,
} from './interceptors/transform.service';
import { responseTransformInterceptor } from './interceptors/transform.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom([PoHttpRequestModule, BrowserAnimationsModule]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(
      withInterceptors([
        responseTransformInterceptor,
        // responseTransformInterceptorContas,
      ])
    ),
  ],
};
