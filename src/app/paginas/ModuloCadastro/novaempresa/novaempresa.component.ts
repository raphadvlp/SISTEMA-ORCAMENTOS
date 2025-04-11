import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Empresas } from '@app/class/empresas';
import { PoDynamicFormField, PoModule, PoNotificationService } from '@po-ui/ng-components';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-novaempresa',
  imports: [PoModule],
  templateUrl: './novaempresa.component.html',
  styleUrl: './novaempresa.component.css'
})
export class NovaempresaComponent {
private http = inject(HttpClient);
  private route = inject(Router);
  private url: string = environment.url;
  private notify = inject(PoNotificationService);

  public isEditing: boolean = false; // Adiciona a propriedade isEditing
  public formNovaEmpresa: Empresas = new Empresas();

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
      maxLength: 2,
      additionalHelpTooltip: 'O código deve ter 3 dígitos.',
      showRequired: true,
    },
    {
      property: 'razao_social',
      label: 'Razão Social',
      type: 'string',
      placeholder: 'Digite a Razão Social',
      required: true,
      gridColumns: 5,
      clean: true,
      noAutocomplete: true,
      maxLength: 60,
      showRequired: true,
      additionalHelpTooltip: 'Máximo 60 caracteres',   
    },
    {
      property: 'nome_fantasia',
      label: 'Nome Fantasia',
      type: 'string',
      placeholder: 'Digite o nome fantasia',
      required: true,
      gridColumns: 5,
      clean: true,
      noAutocomplete: true,
      maxLength: 60,
      showRequired: true,
      additionalHelpTooltip: 'Máximo 60 caracteres', 
    },
    {
      property: 'cnpj',
      label: 'CNPJ',
      type: 'string',
      placeholder: '99.999.999/9999-99',
      required: true,
      gridColumns: 2,
      clean: true,
      noAutocomplete: true,
      maxLength: 14,
      mask: '99.999.999/9999-99', // Máscara para o CNPJ
      additionalHelpTooltip: 'Sem espaços ou caracteres especiais',
      showRequired: true,
    }
  ];

  public confirmarForm(form: Empresas) {
    // Adiciona zeros à esquerda se o código tiver menos de 3 dígitos
    form.codigo = form.codigo.toString().padStart(2, '0');

    // Converte o valor do campo descricao_orcamento para uppercase
    form.razao_social = form.razao_social.toUpperCase();
    form.nome_fantasia = form.nome_fantasia.toUpperCase();

    // Envia os dados para a API
    this.http.post<Empresas>(`${this.url}/api/mock/empresas`, form).subscribe({
      next: (response) => {
        this.notify.success({
          duration: 2000,
          message: 'Empresa cadastrada com sucesso.',
        });
        this.route.navigate(['/empresas']);
      },
      error: (error) => {
        this.notify.error({
          duration: 2000,
          message: `Erro ao cadastrar Empresa: ${error.message}`,
        });
      },
    });
  }
}
