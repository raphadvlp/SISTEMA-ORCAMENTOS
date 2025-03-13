import { HttpInterceptorFn } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

interface ApiResponseUsers {
  data: {
    id: number;
    codigo: string;
    name: string;
    email: string;
    cpf: string;
    department: string;
    blocked: boolean;
    password: string;
    username: string;
  }[];
}

interface ApiResponseContas {
  data: {
    id_contaorcamentaria: number;
    codigo_contaorcamentaria: string;
    nome_contaorcamentaria: string;
    tipo: string;
    condicao: string;
    cod_natureza: string;
    cod_pai: string;
  }[];
}

// export const responseTransformInterceptor: HttpInterceptorFn = (req, next) => {
//   // Filtra apenas as requisições que devem ser manipuladas por este interceptor
//   if (!req.url.includes('/usuario')) {
//     return next(req); // Se não for a URL de usuários, apenas passa adiante
//   }

//   const modifReq = req.clone({
//     setHeaders: {
//       Accept: 'application/json, text/html',
//     },
//   });

//   return next(modifReq).pipe(
//     map((event) => {
//       if (event instanceof HttpResponse) {
//         const responseBody = event.body as ApiResponseUsers;
//         console.log('Dados brutos recebidos:', responseBody);

//         if (responseBody?.data) {
//           const transformedDataUsers = responseBody.data.map((item) => ({
//             id: item.id,
//             name: item.name,
//             email: item.email,
//             cpf: item.cpf,
//             department: item.department,
//             blocked: item.blocked,
//             password: item.password,
//             username: item.username,
//           }));

//           console.log('Dados transformados:', transformedDataUsers);

//           const newBody = {
//             items: transformedDataUsers,
//             hasNext: false,
//             pageSize: transformedDataUsers.length,
//             totalItems: transformedDataUsers.length,
//           };

//           return event.clone({ body: newBody });
//         }
//       }
//       return event;
//     })
//   );
// };

export const responseTransformInterceptorContas: HttpInterceptorFn = (
  req,
  next
) => {
  // Filtra apenas as requisições que devem ser manipuladas por este interceptor
  if (!req.url.includes('/contaorcamentaria')) {
    return next(req); // Se não for a URL de contas, apenas passa adiante
  }

  const modifReq = req.clone({
    setHeaders: {
      Accept: 'application/json, text/html',
    },
  });

  return next(modifReq).pipe(
    map((event) => {
      if (event instanceof HttpResponse) {
        const responseBodyContas = event.body as ApiResponseContas;
        console.log('Dados brutos recebidos Contas:', responseBodyContas);

        if (responseBodyContas?.data) {
          const transformedDataContas = responseBodyContas.data.map((item) => ({
            id: item.id_contaorcamentaria,
            codigo: item.codigo_contaorcamentaria,
            name: item.nome_contaorcamentaria,
            tipo: item.tipo,
            condicao: item.condicao,
            natureza: item.cod_natureza,
            pai: item.cod_pai,
          }));

          console.log('Dados transformados:', transformedDataContas);

          const newBody = {
            items: transformedDataContas,
            hasNext: false,
            pageSize: transformedDataContas.length,
            totalItems: transformedDataContas.length,
          };

          return event.clone({ body: newBody });
        }
      }
      return event;
    })
  );
};
