import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  PoModule,
  PoNotificationService,
  PoDynamicFormField,
} from '@po-ui/ng-components';
import { environment } from '../../../../environments/environment';
import { Centrodecusto } from '../../../class/centrodecusto';

@Component({
  selector: 'app-novocentrodecusto',
  imports: [PoModule],
  templateUrl: './novocentrodecusto.component.html',
  styleUrls: ['./novocentrodecusto.component.css'],
})
export class NovocentrodecustoComponent {
  private http = inject(HttpClient);
  private route = inject(Router);
  private url: string = environment.url;
  private notify = inject(PoNotificationService);

  public fields: PoDynamicFormField[] = [
    {
      property: 'codigo',
      label: 'Código',
      type: 'number', // Define o tipo como number
      placeholder: 'Digite o código',
      required: true,
      gridColumns: 2,
      noAutocomplete: true,
      clean: true,
      maxLength: 10,
    },
    {
      property: 'descricao',
      label: 'Descrição',
      type: 'string',
      placeholder: 'Digite a descrição do orçamento',
      required: true,
      gridColumns: 10,
      clean: true,
      noAutocomplete: true,
    },
  ];

  public formOrcamento: Centrodecusto = new Centrodecusto();
  public isEditing: boolean = false; // Adiciona a propriedade isEditing

  public confirmarForm(form: any) {
    // Adiciona zeros à esquerda se o código tiver menos de 10 dígitos
    form.codigo = form.codigo.toString().padStart(10, '0');

    // Converte o valor do campo descricao_orcamento para uppercase
    form.descricao = form.descricao.toUpperCase();

    // Envia os dados para a API
    this.http.post<any>(`${this.url}/api/mock/centrodecusto`, form).subscribe({
      next: (response) => {
        this.notify.success({
          duration: 2000,
          message: 'Centro de Custo cadastrado com sucesso.',
        });
        this.route.navigate(['/centrodecusto']);
      },
      error: (error) => {
        this.notify.error({
          duration: 2000,
          message: `Erro ao cadastrar Centro de Custo: ${error.message}`,
        });
      },
    });
  }
}
