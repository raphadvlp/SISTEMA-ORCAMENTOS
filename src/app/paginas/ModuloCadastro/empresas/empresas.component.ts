import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ConfigService } from '@app/services/transformConfig.service';
import { PoModalComponent, PoNotificationService, PoDynamicFormField, PoDynamicViewField, PoButtonModule, PoDividerModule, PoDynamicModule, PoModalModule, PoPageModule, PoTableModule } from '@po-ui/ng-components';
import { PoPageDynamicTableComponent, PoPageDynamicTableField, PoPageDynamicTableCustomAction, PoPageDynamicTableActions, PoPageDynamicTableModule } from '@po-ui/ng-templates';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-empresas',
  imports: [
        PoPageDynamicTableModule,
        PoModalModule,
        PoDynamicModule,
        PoPageModule,
        PoDividerModule,
        PoTableModule,
        CommonModule,
        PoButtonModule,
        PoPageDynamicTableModule,
  ],
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.css'
})
export class EmpresasComponent {
title = 'Empresa';

  @ViewChild('pageUsers') pageUsers!: PoPageDynamicTableComponent;
  @ViewChild('cadastroEmpresaDetailModal') empresaModalEl!: PoModalComponent;
  @ViewChild('editModal') editModalEl!: PoModalComponent;

  public itemEditData: any = {};
  public isEditingItem: boolean = false;
  public cadastroEmpresaData: any = {};
  public editData: any = {}; // Dados do formulário de edição/clonagem
  public descricao: string = '';
  public url: string = `${environment.url}/api/mock/empresas`;

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private notify: PoNotificationService,
    private router: Router
  ) {
    configService.setConfig('empresa', 'id');
  }

  public itemFields: PoDynamicFormField[] = [
    { property: 'codigo', label: 'Código', required: true },
    { property: 'descricao', label: 'Descrição', required: true },
  ];

  public fields: PoPageDynamicTableField[] = [
    {
      property: 'id',
      label: 'ID',
      type: 'string',
      key: true,
      visible: false,
      allowColumnsManager: true,
    },
    {
      property: 'codigo',
      label: 'Código',
      type: 'string',
      filter: true,
      allowColumnsManager: true,
    },
    {
      property: 'razao_social',
      label: 'Razão Social',
      type: 'string',
      filter: true,
      allowColumnsManager: true,
    },
    {
      property: 'nome_fantasia',
      label: 'Nome Fantasia',
      type: 'string',
      filter: true,
      allowColumnsManager: true,
    },
    {
      property: 'cnpj',
      label: 'CNPJ',
      type: 'string',
      filter: true,
      allowColumnsManager: true,
      // mask: '99.999.999/9999-99',
      // help: 'Ex: 12345678000195 sem pontos e traço',
    },
  ];

  public tableActions: PoPageDynamicTableCustomAction[] = [
    { label: 'Detalhes', action: this.openDetailUser.bind(this) },
    { label: 'Editar', action: this.openEditModal.bind(this) },
    { label: 'Clonar', action: this.openCloneModal.bind(this) }, // Nova ação de clonar
  ];

  public cadastroEmpresaFields: PoDynamicViewField[] = [
    { property: 'codigo', label: 'Código', gridColumns: 6 },
    { property: 'razao_social', label: 'Razão Social', gridColumns: 6 },
    { property: 'nome_fantasia', label: 'Nome Fantasia', gridColumns: 6 },
    { property: 'cnpj', label: 'CNPJ', gridColumns: 6 },
  ];

  public editFields: PoDynamicFormField[] = [
    { property: 'codigo', label: 'Código', required: true, disabled: true },
    { property: 'razao_social', label: 'Razão Social', required: true },
    { property: 'nome_fantasia', label: 'Nome Fantasia', required: true },
    { property: 'cnpj', label: 'CNPJ', required: true },
  ];

  public actions: PoPageDynamicTableActions = {
    new: '/novaempresa',
    remove: true,
  };

  public openDetailUser(conta: any) {
    this.descricao = conta.descricao;
    this.cadastroEmpresaData = conta;

    if (!this.cadastroEmpresaData.itens) {
      this.cadastroEmpresaData.itens = [];
    }

    this.empresaModalEl.open();
  }

  public openEditModal(conta: any) {
    this.editData = { ...conta }; // Copia os dados do centro de custo para edição
    this.editModalEl.open();
  }

  public openCloneModal(conta: any) {
    const clonedData = { ...conta };
    delete clonedData.id; // Remove o ID para criar um novo registro

    // Redireciona para a página de criação com os dados clonados como parâmetros
    this.router.navigate(['/novaempresa'], { queryParams: clonedData });
  }

  public saveEdit() {
    const url = this.isEditingItem ? `${this.url}` : `${this.url}/create`; // Define a URL com base na ação
    const payload = {
      codigo: this.editData.codigo,
      razao_social: this.editData.razao_social,
      nome_fantasia: this.editData.nome_fantasia,
      cnpj: this.editData.cnpj,
    };

    console.log('URL da requisição:', url);
    console.log('Dados enviados:', payload);

    const request = this.isEditingItem
      ? this.http.put(url, { ...payload, id: this.editData.id }) // Atualiza o registro existente
      : this.http.post(url, payload); // Cria um novo registro

    request.subscribe({
      next: () => {
        const message = this.isEditingItem
          ? 'Empresa atualizada com sucesso!'
          : 'Empresa criada com sucesso!';
        this.notify.success(message);
        this.editModalEl.close();
        window.location.reload(); // Recarrega a página
      },
      error: (error) => {
        console.error('Erro ao salvar Empresa:', error);
        this.notify.error(`Erro ao salvar Empresa: ${error.message}`);
      },
    });
  }

  onFormChange(changes: any) {
    this.editData = { ...this.editData, ...changes }; // Atualiza os dados com as alterações
  }
}