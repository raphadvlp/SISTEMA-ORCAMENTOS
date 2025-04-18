import { Component, ViewChild } from '@angular/core';
import {
  PoContainerModule,
  PoDynamicModule,
  PoDynamicViewField,
  PoModalComponent,
  PoModalModule,
  PoPageModule,
  PoNotificationService,
  PoDynamicFormField,
} from '@po-ui/ng-components';
import {
  PoPageDynamicTableActions,
  PoPageDynamicTableCustomAction,
  PoPageDynamicTableField,
  PoPageDynamicTableModule,
} from '@po-ui/ng-templates';
import { environment } from '../../../../environments/environment';
import { ConfigService } from '../../../services/transformConfig.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contas-orcamentarias',
  imports: [
    PoPageDynamicTableModule,
    PoModalModule,
    PoDynamicModule,
    PoPageModule,
  ],
  templateUrl: './contas-orcamentarias.component.html',
  styleUrls: ['./contas-orcamentarias.component.css'],
})
export class ContasOrcamentariasComponent {
  title = 'Contas Orçamentárias';
  public url: string = `${environment.url}/api/mock/contaorcamentaria`;
  public codigo_contaorcamentaria: string = '';
  public contaOrcamentariaData: any = {};

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private notify: PoNotificationService
  ) {
    configService.setConfig('contaorcamentaria', 'id_contaorcamentaria');
  }

  @ViewChild('pageUsers') pageUsers: any; // Referência à tabela de contas orçamentárias
  @ViewChild('userDetailModal') userModalEl!: PoModalComponent;
  @ViewChild('userEditModal') userEditModalEl!: PoModalComponent;

  public fields: PoPageDynamicTableField[] = [
    {
      property: 'id_contaorcamentaria',
      label: 'ID Contaorcamentaria',
      type: 'string',
      key: true,
      visible: false,
      allowColumnsManager: true,
    },
    {
      property: 'codigo_contaorcamentaria',
      label: 'Código',
      type: 'string',
      filter: true,
      allowColumnsManager: true,
    },
    {
      property: 'nome_contaorcamentaria',
      label: 'Nome',
      type: 'string',
      filter: true,
      allowColumnsManager: true,
    },
    {
      property: 'cod_pai',
      label: 'Código Pai',
      type: 'string',
      allowColumnsManager: true,
    },
    {
      property: 'tipo',
      label: 'Tipo',
      type: 'string',
      allowColumnsManager: true,
    },
    {
      property: 'condicao',
      label: 'Condição',
      type: 'string',
      allowColumnsManager: true,
    },
    {
      property: 'cod_natureza',
      label: 'Código Natureza',
      type: 'string',
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
    new: '/novacontaorcamentaria',
    remove: true,
  };

  public userFields: PoDynamicViewField[] = [
    { property: 'codigo_contaorcamentaria', label: 'Código', gridColumns: 6 },
    {
      property: 'nome_contaorcamentaria',
      label: 'Nome',
      gridColumns: 6,
      divider: 'Dados da Conta',
    },
    { property: 'tipo', label: 'Tipo', gridColumns: 6 },
    { property: 'condicao', label: 'Condição', gridColumns: 6 },
    { property: 'cod_natureza', label: 'Código Natureza', gridColumns: 6 },
  ];

  public userFormFields: PoDynamicFormField[] = [
    { property: 'codigo_contaorcamentaria', label: 'Código', gridColumns: 6 },
    {
      property: 'nome_contaorcamentaria',
      label: 'Nome',
      gridColumns: 6,
      divider: 'Dados da Conta',
    },
    { property: 'tipo', label: 'Tipo', gridColumns: 6 },
    { property: 'condicao', label: 'Condição', gridColumns: 6 },
    { property: 'cod_natureza', label: 'Código Natureza', gridColumns: 6 },
  ];

  public primaryAction = {
    action: this.saveUser.bind(this),
    label: 'Salvar',
  };

  public secondaryAction = {
    action: this.closeModal.bind(this),
    label: 'Cancelar',
  };

  public openDetailUser(conta: any) {
    this.codigo_contaorcamentaria = conta.nome_contaorcamentaria;
    this.contaOrcamentariaData = conta;
    this.userModalEl.open();
  }

  public openEditUser(conta: any) {
    this.contaOrcamentariaData = { ...conta }; // Copia os dados da conta orçamentária para edição
    this.userEditModalEl.open();
  }

  public saveUser() {
    const url = `${this.url}`; // URL sem o ID
    const payload = {
      id_contaorcamentaria: this.contaOrcamentariaData.id_contaorcamentaria, // Inclui o ID no payload
      ...this.contaOrcamentariaData, // Envia todos os dados da conta orçamentária
    };

    console.log('URL da requisição:', url);
    console.log('Dados enviados:', payload);

    this.http.put(url, payload).subscribe({
      next: () => {
        this.notify.success('Conta orçamentária atualizada com sucesso!');
        this.userEditModalEl.close();
        window.location.reload(); // Recarrega a página //TODO: ENCONTRAR OUTRO MÉTODO, POIS NÃO É O IDEAL
      },
      error: (error) => {
        console.error('Erro ao atualizar conta orçamentária:', error);
        if (error.status === 404) {
          this.notify.error(
            'Conta orçamentária não encontrada. Verifique o ID ou o endpoint.'
          );
        } else {
          this.notify.error(
            `Erro ao atualizar conta orçamentária: ${error.message}`
          );
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
