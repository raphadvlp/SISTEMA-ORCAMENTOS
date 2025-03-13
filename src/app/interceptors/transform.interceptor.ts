import { HttpInterceptorFn } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { map, catchError, throwError } from 'rxjs';
import { ConfigService } from '../services/transformConfig.service';
import { inject } from '@angular/core';

interface ApiResponse {
  success?: number;
  data?: Record<string, any>;
}

export const responseTransformInterceptor: HttpInterceptorFn = (req, next) => {
  const modifReq = req.clone({
    setHeaders: {
      Accept: 'application/json, text/html',
    },
  });

  const configService = inject(ConfigService);

  const endpoint = configService.getEndpoint();
  const keyField = configService.getKeyField();

  console.log(endpoint);
  console.log(keyField);

  return next(modifReq).pipe(
    map((event) => {
      if (event instanceof HttpResponse) {
        const responseBody: ApiResponse = event.body ?? {};

        console.log('🔍 Dados brutos recebidos:', responseBody);

        if (responseBody.data) {
          //   const keys = Object.keys(responseBody.data);
          console.log('🔍 Chaves encontradas:', responseBody.data);
          const keys = Array.isArray(responseBody.data)
            ? []
            : Object.keys(responseBody.data);

          if (Array.isArray(responseBody.data)) {
            console.log('Teste');

            const items = responseBody.data;

            console.log('🙋‍♂️🙋‍♂️🙋‍♂️🙋!!!!' + endpoint);

            const transformedData = items.map((item: any) => ({
              ...item,
              id: item[keyField] ?? 'N/A',
            }));

            console.log('✅ Dados transformados:', transformedData);

            const newBody = {
              version: 1,
              title: 'Custom Table Title',
              items: transformedData,
              hasNext: false,
              page_size: 1,
              keepFilters: true,
            };

            console.log('📤 HTTP resposta retornada:', newBody);

            return event.clone({ body: newBody });
          }
        }
      }
      return event;
    }),
    catchError((err) => {
      console.error('❌ Erro no interceptor:', err);
      return throwError(() => err);
    })
  );
};
