import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
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
export class NovousuarioComponent implements OnInit {

  private http = inject(HttpClient);
  private route = inject(Router);
  private url: string = environment.url;
  private notify = inject(PoNotificationService);

  // Valores do formulário
  public formNovoUsuario: any = {};

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
      showRequired: true,
    },
    {
      property: 'email',
      label: 'E-mail',
      type: 'string',
      placeholder: 'Digite o e-mail',
      gridColumns: 6,
      noAutocomplete: true,
      clean: true,
    },
    {
      property: 'cpf',
      label: 'CPF',
      type: 'string',
      placeholder: 'Digite o CPF',
      gridColumns: 3,
      noAutocomplete: true,
      clean: true,
      // help: 'Ex: 12345678900 sem pontos e traço',
      mask: '999.999.999-99',
    },
    // {
    //   property: 'department',
    //   label: 'Departamento',
    //   options: [
    //     { label: 'Financeiro', value: 'Financeiro' },
    //     { label: 'Contabilidade', value: 'Contabilidade' },
    //     { label: 'Fiscal', value: 'Fiscal' },
    //     { label: 'Comercial', value: 'Comercial' },
    //     { label: 'Marketing', value: 'Marketing' },
    //     { label: 'Operacional', value: 'Operacional' },
    //     { label: 'Controladoria', value: 'Controladoria' },
    //     { label: 'Loistica', value: 'Logistica' },
    //     { label: 'Departamento Pessoal', value: 'DP' },
    //     { label: 'Recurso Humano', value: 'RH' },
    //     { label: 'Tecologia da Informação', value: 'TI' },
    //   ],
    //   forceOptionsComponentType: ForceOptionComponentEnum.select,
    //   gridColumns: 6,
    // },
    {
      property: 'username',
      label: 'Usuário',
      type: 'string',
      placeholder: 'Digite o usuário',
      required: true,
      gridColumns: 3,
      noAutocomplete: true,
      clean: true,
      showRequired: true,
    },
    {
      property: 'password',
      label: 'Senha',
      type: 'string',
      placeholder: 'Digite a senha',
      required: true,
      gridColumns: 3,
      secret: true,
      showRequired: true,
    },
    {
      property: 'confirm_password',
      label: 'Confirme a Senha',
      type: 'string',
      placeholder: 'Confirme a senha',
      required: true,
      gridColumns: 3,
      secret: true,
      showRequired: true,
    },

    {
      property: 'blocked',
      label: 'Bloqueado',
      placeholder: 'Sim ou Não',
      // type: 'string',
      required: true,
      options: [
        { label: 'Não', value: 'nao' },
        { label: 'Sim', value: 'sim' },
      ],
      fieldLabel: 'label',
      fieldValue: 'value',
      forceOptionsComponentType: ForceOptionComponentEnum.select,
      gridColumns: 3,
      showRequired: true,
    },
    { 
      property: 'mustChangePassword',
      label: 'Solicitar alteração de senha no próximo login',
      type: 'boolean',
      booleanFalse: 'Não',
      booleanTrue: 'Sim',
    }
  ];

  public userData: any = {}; // Dados do formulário

  onFormChange(changes: any) {
    this.userData = { ...this.userData, ...changes }; // Atualiza os dados do formulário
  }
  ngOnInit() {
    // Define um valor inicial para o campo 'bloqueado'
    this.formNovoUsuario.blocked = 'nao';
  }

  public confirmarForm(form: any) {
    //Verifica se a senha e a confirmação de senha são iguais
    if(form.password !== form.confirm_password) {
      this.notify.error({
        duration: 2000,
        message: 'As senhas não conferem, precisam ser iguais',
      });
      return;
    }
    this.http.post<any>(`${this.url}/api/mock/usuario`, form).subscribe({
      next: (value) =>
        this.notify.success({
          duration: 2000,
          message: `Usuário ${form.username} cadastrado com sucesso`,
          // message: `Usuário cadastrado com sucesso`,
        }),
      error: (error) =>
        this.notify.error({ duration: 2000, message: error.mensagem }),
      complete: () => this.route.navigate(['/usuarios']),
    });
    this.route.navigate(['/usuarios']);
  }

  public saveUser() {
    const payload = {
      username: this.userData.username,
      email: this.userData.email,
      mustChangePassword: this.userData.mustChangePassword || false
    };

    this.http.post(`${environment.url}/api/users`, payload).subscribe({
      next: () => {
        this.notify.success('Usuário salvo com sucesso!');
        this.route.navigate(['/usuarios']);
      },
      error: (error) => {
        console.error('Erro ao salvar usuário:', error);
        this.notify.error('Erro ao salvar usuário.');
      }
    });
  }
}
