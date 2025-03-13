import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  ForceOptionComponentEnum,
  PoButtonModule,
  PoDynamicFormField,
  PoDynamicModule,
  PoNotificationService,
  PoPageModule,
} from '@po-ui/ng-components';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-novousuario',
  imports: [PoPageModule, PoDynamicModule, PoButtonModule],
  templateUrl: './novousuario.component.html',
  styleUrl: './novousuario.component.css',
})
export class NovousuarioComponent {
  public fields: PoDynamicFormField[] = [
    // { property: 'id', label: 'ID', type: 'number', gridColumns: 12 },
    {
      property: 'name',
      label: 'Nome Completo',
      type: 'string',
      placeholder: 'Digite o nome completo',
      required: true,
      gridColumns: 6,
      noAutocomplete: true,
      clean: true,
    },
    {
      property: 'email',
      label: 'E-mail',
      type: 'string',
      placeholder: 'Digite o e-mail',
      required: true,
      gridColumns: 6,
      noAutocomplete: true,
      clean: true,
    },
    {
      property: 'cpf',
      label: 'CPF',
      type: 'string',
      placeholder: 'Digite o CPF',
      required: true,
      gridColumns: 6,
      noAutocomplete: true,
      clean: true,
      // help: 'Ex: 12345678900 sem pontos e traço',
      mask: '999.999.999-99',
    },
    {
      property: 'department',
      label: 'Departamento',
      options: [
        { label: 'Financeiro', value: 'Financeiro' },
        { label: 'Contabilidade', value: 'Contabilidade' },
        { label: 'Fiscal', value: 'Fiscal' },
        { label: 'Comercial', value: 'Comercial' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Operacional', value: 'Operacional' },
        { label: 'Controladoria', value: 'Controladoria' },
        { label: 'Loistica', value: 'Logistica' },
        { label: 'Departamento Pessoal', value: 'DP' },
        { label: 'Recurso Humano', value: 'RH' },
        { label: 'Tecologia da Informação', value: 'TI' },
      ],
      forceOptionsComponentType: ForceOptionComponentEnum.select,
      gridColumns: 6,
    },
    {
      property: 'username',
      label: 'Usuário',
      type: 'string',
      placeholder: 'Digite o usuário',
      required: true,
      gridColumns: 6,
      noAutocomplete: true,
      clean: true,
    },
    {
      property: 'password',
      label: 'Senha',
      type: 'string',
      placeholder: 'Digite a senha',
      required: true,
      gridColumns: 6,
      secret: true,
    },
    {
      property: 'confirm_password',
      label: 'Confirme a Senha',
      type: 'string',
      placeholder: 'Confirme a senha',
      required: true,
      gridColumns: 6,
      secret: true,
    },

    {
      property: 'blocked',
      label: 'Usuário Bloqueado',
      type: 'string',
      options: [
        { label: 'Sim', value: 'sim' },
        { label: 'Não', value: 'nao' },
      ],
      required: true,
      fieldLabel: 'label',
      fieldValue: 'value',
      forceOptionsComponentType: ForceOptionComponentEnum.select,
    },
  ];

  private http = inject(HttpClient);
  private route = inject(Router);
  private url: string = environment.url;
  private notify = inject(PoNotificationService);

  public confirmarForm(form: any) {
    this.http.post<any>(`${this.url}/api/mock/usuario`, form).subscribe({
      next: (value) =>
        this.notify.success({
          duration: 2000,
          // message: `Usuário ${value.Nome} cadastrado com sucesso`,
          message: `Usuário cadastrado com sucesso`,
        }),
      error: (error) =>
        this.notify.error({ duration: 2000, message: error.mensagem }),
      complete: () => this.route.navigate(['/usuarios']),
    });
    this.route.navigate(['/usuarios']);
  }
}
