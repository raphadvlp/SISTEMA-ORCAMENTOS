import { Component, ViewChild } from '@angular/core';
import {
  PoPageDynamicTableActions,
  PoPageDynamicTableCustomAction,
  PoPageDynamicTableField,
  PoPageDynamicTableModule,
} from '@po-ui/ng-templates';
import { environment } from '../../../../environments/environment';
import {
  PoDynamicModule,
  PoModalComponent,
  PoModalModule,
  PoPageModule,
  PoNotificationService,
  PoDynamicFormField,
  ForceOptionComponentEnum,
} from '@po-ui/ng-components';
import { ConfigService } from '../../../services/transformConfig.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuarios',
  imports: [
    PoPageDynamicTableModule,
    PoModalModule,
    PoDynamicModule,
    PoPageModule,
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent {

  public url: string = `${environment.url}/api/mock/usuario`;
  public username: string = '';
  public userData: any = {};

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private notify: PoNotificationService
  ) {
    configService.setConfig('usuario', 'id');
  }

  @ViewChild('pageUsers') pageUsers: any; // Referência à tabela de usuários
  @ViewChild('userDetailModal') userModalEl!: PoModalComponent;
  @ViewChild('userEditModal') userEditModalEl!: PoModalComponent;

  public fields: PoPageDynamicTableField[] = [
    {
      property: 'id',
      label: 'ID',
      type: 'string',
      key: true,
      visible: false,
      allowColumnsManager: true,
    },
    { property: 'username', label: 'Usuário', type: 'string', filter: true },
    { property: 'name', label: 'Nome Completo', type: 'string', filter: true },
    { property: 'email', label: 'E-mail', type: 'string' },
    { property: 'cpf', label: 'CPF', type: 'string', filter: true },
    // { property: 'department', label: 'Departamento', type: 'string' },
    {
      property: 'blocked',
      label: 'Usuário Bloqueado',
      options: [
        { label: 'Sim', value: 'sim'},
        { label: 'Nao', value: 'nao' },
      ],
      type: 'string',
      filter: true,
      allowColumnsManager: true,
    },
  ];

  public tableActions: PoPageDynamicTableCustomAction[] = [
    {
      label: 'Detalhes',
      action: this.openDetailUser.bind(this),
      // icon: 'an an-user',
    },
    {
      label: 'Editar',
      action: this.openEditUser.bind(this),
      // icon: 'po-icon-edit',
    },
  ];

  public actions: PoPageDynamicTableActions = {
    new: '/novousuario',
    remove: true,
  };

  public userFormFields: PoDynamicFormField[] = [
    { property: 'id', label: 'ID', gridColumns: 6, key: true, visible: false },
    { property: 'name', label: 'Nome Completo', gridColumns: 6 },
    { property: 'email', label: 'E-mail', gridColumns: 6 },
    { property: 'cpf', label: 'CPF', gridColumns: 6 },
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
    { property: 'username', label: 'Usuário', gridColumns: 6, disabled: true },
    { property: 'password', label: 'Senha', gridColumns: 6, secret: true },
    {
      property: 'confirm_password',
      label: 'Confirme a Senha',
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
      fieldLabel: 'label',
      fieldValue: 'value',
      forceOptionsComponentType: ForceOptionComponentEnum.select,
    },
  ];

  public userViewFields: PoDynamicFormField[] = [
    { property: 'id', label: 'ID', gridColumns: 6, key: true },
    { property: 'name', label: 'Nome Completo', gridColumns: 6 },
    { property: 'email', label: 'E-mail', gridColumns: 6 },
    { property: 'cpf', label: 'CPF', gridColumns: 6 },
    // { property: 'department', label: 'Departamento', gridColumns: 6 },
    { property: 'username', label: 'Usuário', gridColumns: 6 },
    {
      property: 'blocked',
      label: 'Usuário Bloqueado',
      type: 'string',
      options: [
        { label: 'Sim', value: 'sim' },
        { label: 'Não', value: 'nao' },
      ],
      fieldLabel: 'label',
      fieldValue: 'value',
      forceOptionsComponentType: ForceOptionComponentEnum.select,
    },
  ];

  public primaryAction = {
    action: this.saveUser.bind(this),
    label: 'Salvar',
  };

  public secondaryAction = {
    action: this.closeModal.bind(this),
    label: 'Cancelar',
  };

  public actionCloseDetail = {
    action: this.closeDetailModal.bind(this),
    label: 'Fechar',
  };

  public openDetailUser(user: any) {
    this.username = user.name;
    this.userData = user;
    this.userModalEl.open();
  }

  public openEditUser(user: any) {
    this.userData = { ...user }; // Copia os dados do usuário para edição
    this.userEditModalEl.open();
  }

  public saveUser() {
    const url = `${this.url}`; // URL sem o ID
    const payload = {
      id: this.userData.id, // Inclui o ID no payload
      ...this.userData, // Envia todos os dados do usuário
    };

    console.log('URL da requisição:', url);
    console.log('Dados enviados:', payload);

    this.http.put(url, payload).subscribe({
      next: () => {
        this.notify.success('Usuário atualizado com sucesso!');
        this.userEditModalEl.close();
        this.pageUsers.updateDataTable(); // Atualiza a tabela
      },
      error: (error) => {
        console.error('Erro ao atualizar usuário:', error);
        if (error.status === 404) {
          this.notify.error(
            'Usuário não encontrado. Verifique o ID ou o endpoint.'
          );
        } 
        else 
        {
          this.notify.error(`Erro ao atualizar usuário: ${error.message}`);
        }
      },
    });
  }

  public closeModal() {
    this.userEditModalEl.close();
  }

  public closeDetailModal() {
    this.userModalEl.close();
  }
}
