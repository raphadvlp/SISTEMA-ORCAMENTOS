// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'brCurrency',
//   standalone: true // Adicione esta linha se estiver usando Angular 15+ com standalone components
// })
// export class BrCurrencyPipe implements PipeTransform {
//   transform(value: number | string | null | undefined): string {
//     // Casos de valores inválidos
//     if (value === null || value === undefined || value === '') {
//       return '';
//     }

//     // Converte para número
//     let num: number;
//     if (typeof value === 'string') {
//       // Remove todos os caracteres não numéricos exceto vírgula e ponto
//       const cleanedValue = value
//         .replace(/[^\d,.-]/g, '') // Remove caracteres não numéricos
//         .replace(/\.(?=\d*\.)/g, '') // Remove pontos extras (exceto o último)
//         .replace(',', '.'); // Substitui vírgula por ponto
      
//       num = parseFloat(cleanedValue);
//     } else {
//       num = value;
//     }

//     // Verifica se é um número válido
//     if (isNaN(num)) {
//       return '';
//     }

//     // Formatação para moeda brasileira
//     try {
//       return num.toLocaleString('pt-BR', {
//         style: 'currency',
//         currency: 'BRL',
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2
//       });
//     } catch {
//       // Fallback para caso de erro na formatação
//       return num.toFixed(2).replace('.', ',');
//     }
//   }
// }