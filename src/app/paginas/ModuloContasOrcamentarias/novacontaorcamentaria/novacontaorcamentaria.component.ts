import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  ForceOptionComponentEnum,
  PoDynamicFormField,
  PoLookupColumn,
  PoModule,
  PoNotificationService,
} from '@po-ui/ng-components';
import { environment } from '../../../../environments/environment';
import { Contaorcamentaria } from '@app/class/contaorcamentaria';

@Component({
  selector: 'app-novacontaorcamentaria',
  imports: [PoModule],
  templateUrl: './novacontaorcamentaria.component.html',
  styleUrls: ['./novacontaorcamentaria.component.css'],
})
export class NovacontaorcamentariaComponent {
  private http = inject(HttpClient);
  private route = inject(Router);
  private url: string = environment.url;
  private notify = inject(PoNotificationService);
  private codigoExiste: boolean = false; // Flag para indicar se o código já existe
  
  public filterService: string = `${this.url}/api/mock/contaorcamentaria`;

  public fields: PoDynamicFormField[] = [
    {
      property: 'id_contaorcamentaria',
      label: 'ID Conta Orçamentária',
      type: 'string',
      placeholder: 'ID',
      required: true,
      gridColumns: 4,
      noAutocomplete: true,
      clean: true,
      visible: false,
    },
    {
      property: 'codigo_contaorcamentaria',
      label: 'Código',
      type: 'number',
      placeholder: 'Código Conta Orçamentária',
      required: true,
      gridColumns: 2,
      noAutocomplete: true,
      clean: true,
      maxLength: 10,
    },
    {
      property: 'nome_contaorcamentaria',
      label: 'Nome',
      type: 'string',
      placeholder: 'Nome da Conta Orçamentária',
      required: true,
      gridColumns: 6,
      clean: true,
    },
    {
      property: 'tipo',
      label: 'Tipo',
      placeholder: 'Selecione, analítico ou sintético',
      options: [
        { label: 'Analítico', value: 'Analitico', selected: true },
        { label: 'Sintético', value: 'Sintetico' },
      ],
      forceOptionsComponentType: ForceOptionComponentEnum.select,
      gridColumns: 2,
    },
    {
      property: 'condicao',
      label: 'Condição',
      placeholder: 'Selecione, Receita ou Despesa',
      options: [
        { label: 'Receita', value: 'Receita' },
        { label: 'Despesa', value: 'Despesa' },
      ],
      forceOptionsComponentType: ForceOptionComponentEnum.select,
      gridColumns: 2,
    },
    {
      property: 'cod_natureza',
      label: 'Natureza',
      type: 'number',
      placeholder: 'Código Natureza',
      // required: true,
      gridColumns: 2,
      clean: true,
      noAutocomplete: true,
      maxLength: 10,
    },
    {
      property: 'cod_pai',
      label: 'Conta Pai',
      type: 'number',
      placeholder: 'Codigo Pai',
      required: true,
      gridColumns: 2,
      clean: true,
      noAutocomplete: true,
      maxLength: 10,
    },
  ];

  public columns: PoLookupColumn[] = [
    { property: 'cod_pai', label: 'Código Conta Orçamentária' },
    { property: 'nome_contaorcamentaria', label: 'Nome Conta Orçamentária' },
  ];

  // Método para verificar se o código da conta orçamentária já existe
  verificarCodigo(codigo: number) {
    if (codigo) {
      // Simulação de uma requisição HTTP que retorna o JSON fornecido
      this.http.get<any>(`${this.url}/api/mock/contaorcamentaria`).subscribe({
        next: (response) => {
          // Verifica se o código já existe no array "data"
          const codigoExiste = response.data.some(
            (item: any) => item.codigo_contaorcamentaria === codigo.toString()
          );

          if (codigoExiste) {
            this.codigoExiste = true;
            this.notify.warning({
              duration: 2000,
              message: 'O código da conta orçamentária já existe.',
            });
          } else {
            this.codigoExiste = false;
          }
        },
        error: (error) => {
          this.notify.error({
            duration: 2000,
            message: `Erro ao verificar código: ${error.message}`,
          });
        },
      });
    }
  }

  // Método para lidar com mudanças no formulário
  onFormChange(event: any) {
    if (event.property === 'codigo_contaorcamentaria') {
      this.verificarCodigo(event.value);
    }
  }

  public confirmarForm(form: any) {
    if (this.codigoExiste) {
      this.notify.warning({
        duration: 2000,
        message:
          'O código da conta orçamentária já existe. Não é possível cadastrar.',
      });
      return;
    }

    this.http
      .post<Contaorcamentaria>(`${this.url}/api/mock/contaorcamentaria`, form)
      .subscribe({
        next: (value) =>
          this.notify.success({
            duration: 2000,
            message: `Conta Orçamentária cadastrada com sucesso`,
          }),
        error: (error) =>
          this.notify.error({ duration: 2000, message: error.mensagem }),
        complete: () => this.route.navigate(['/contas-orcamentarias']),
      });
  }
}
