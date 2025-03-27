// br-currency.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'brCurrency'
})
export class BrCurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    // Casos de valores vazios
    if (value === null || value === undefined || value === '') {
      return '';
    }

    // Converte para número (tratando vírgulas como separador decimal)
    let num: number;
    if (typeof value === 'string') {
      // Remove pontos (separadores de milhar) e substitui vírgula por ponto
      const cleanedValue = value.replace(/\./g, '').replace(',', '.');
      num = parseFloat(cleanedValue);
    } else {
      num = value;
    }

    // Verifica se é um número válido
    if (isNaN(num)) {
      return '';
    }

    // Formatação robusta para moeda brasileira
    return num.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}