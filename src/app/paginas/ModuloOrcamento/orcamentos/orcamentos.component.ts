import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  PoDividerModule,
  PoDynamicModule,
  PoDynamicViewField,
  PoModalComponent,
  PoModalModule,
  PoPageModule,
  PoTableColumn,
  PoTableModule,
  PoDynamicFormField,
  PoNotificationService,
  PoButtonModule,
  ForceOptionComponentEnum,
} from '@po-ui/ng-components';
import {
  PoPageDynamicTableActions,
  PoPageDynamicTableCustomAction,
  PoPageDynamicTableField,
  PoPageDynamicTableModule,
  PoPageDynamicTableComponent,
} from '@po-ui/ng-templates';
import { environment } from '../../../../environments/environment';
import { ConfigService } from '../../../services/transformConfig.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NovoorcamentoComponent } from '../novoorcamento/novoorcamento.component';
import { AdicionaritenorcamentoComponent } from '../../ModuloItensDoOrcamento/itenorcamento/adicionaritenorcamento.component';

@Component({
  selector: 'app-orcamentos',
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
    AdicionaritenorcamentoComponent,
  ],
  templateUrl: './orcamentos.component.html',
  styleUrls: ['./orcamentos.component.css'],
})
export class OrcamentosComponent implements OnInit {
  title = 'Orçamentos';

  lookupServiceContaOrcamentaria = `${environment.url}/api/mock/contaorcamentaria`;
  lookupServiceCentroDeCusto = `${environment.url}/api/mock/centrodecusto`;
  lookupServiceEmpresas = `${environment.url}/api/mock/empresas`;

  public url: string = `${environment.url}/api/mock/orcamento`;

  // Variável para controlar se está no modo de edição
  public isEditMode: boolean = false;
  public editData: any = {};

  // Dados do novo item
  public newItem: any = {};

  // Dados do item sendo editado
  public itemEditData: any = {};
  public orcamentoData: any = {};
  public descricao_orcamento: string = '';
  public isEditingItem: boolean = false;

  @ViewChild('userDetailModal') userModalEl!: PoModalComponent;
  @ViewChild('editModal') editModalEl!: PoModalComponent;
  @ViewChild('pageOrcamentos') pageOrcamentos!: PoPageDynamicTableComponent;
  // @ViewChild('pageOrcamentos') pageOrcamentos: any; // Referência à tabela de orçamentos

  // Referência ao modal de edição de itens
  @ViewChild('editItemModal') editItemModal!: PoModalComponent;

  // Referência ao modal de adição de itens
  @ViewChild('addItemModal') addItemModal!: PoModalComponent;

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private notify: PoNotificationService,
    private cdr: ChangeDetectorRef // Injete o ChangeDetectorRef
  ) {
    configService.setConfig('orcamento', 'id');
  }

  ngOnInit() {
    this.loadData(); // Carrega os dados ao inicializar o componente
  }

  // Método para carregar os dados
  public loadData() {
    this.http.get<any>(`${this.url}`).subscribe({
      next: (data) => {
        // this.editData = data; // Atualiza os dados do componente
        this.editData = { ...data }; // Cria uma nova referência para o objeto
        this.editData.itens = [...data.itens]; // Cria uma nova referência para o array de itens
        this.cdr.detectChanges(); // Força a detecção de mudanças
        console.log('Dados carregados:', this.editData); // Verifique no console
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
      },
    });
  }

  //Campos da tabela princiapl
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
      property: 'codigo_orcamento',
      label: 'Código',
      type: 'string',
      filter: true,
      allowColumnsManager: true,
    },
    // {
    //   property: 'empresa',
    //   label: 'Empresa',
    //   type: 'string',
    //   filter: true,
    //   allowColumnsManager: true,
    // },
    {
      property: 'descricao_orcamento',
      label: 'Descrição',
      type: 'string',
      filter: true,
      allowColumnsManager: true,
    },
    {
      property: 'periodo',
      label: 'Período',
      type: 'string',
      filter: true,
      allowColumnsManager: true,
    },
    {
      property: 'dt_inicio',
      label: 'Data Início',
      type: 'date', //TODO: VERIFICAR COMO IRÁ SE COMPORTAR NO BANCO DE DADOS
      allowColumnsManager: true,
      format: 'dd/MM/yyyy',
    },
    {
      property: 'dt_fim',
      label: 'Data Final',
      type: 'date', //TODO: VERIFICAR COMO IRÁ SE COMPORTAR NO BANCO DE DADOS
      allowColumnsManager: true,
      format: 'dd/MM/yyyy', 
    },
    {
      property: 'numero_versao',
      label: 'Versão',
      type: 'string',
      allowColumnsManager: true,
    },
    {
      property: 'bloqueado',
      label: 'Bloqueado',
      type: 'string',
      allowColumnsManager: true,
    },
  ];

  public tableActions: PoPageDynamicTableCustomAction[] = [
    {
      label: 'Detalhes',
      action: this.openDetailUser.bind(this),
    },
    {
      label: 'Editar',
      action: this.openEditModal.bind(this),
    },
  ];

  public actions: PoPageDynamicTableActions = {
    new: '/novoorcamento',
    remove: true,
  };

    // Campos do formulário de edição de itens
    public itemFields: PoDynamicFormField[] = [
      { property: 'item', label: 'Item', required: true, disabled: true },
      {
        property: 'empresa',
        label: 'Empresa',
        type: 'string',
        placeholder: 'Selecione uma Empresa',
        required: true,
        clean: true,
        maxLength: 3,
        searchService: this.lookupServiceEmpresas,
        fieldLabel: 'codigo', // Exibe apenas o código
        fieldValue: 'codigo', // Valor retornado ao selecionar
        columns: [ // Colunas exibidas no lookup
          { property: 'codigo', label: 'Código' },
          { property: 'razao_social', label: 'Razão Social' },
          { property: 'nome_fantasia', label: 'Nome Fanasia' },
        ],
        noAutocomplete: true,
      },
      // { property: 'orcamento', label: 'Orçamento', required: true },
      { property: 'conta', label: 'Conta', required: true ,
        searchService: this.lookupServiceContaOrcamentaria,
        fieldLabel: 'nome_contaorcamentaria', // Exibe apenas o código
        fieldValue: 'nome_contaorcamentaria', // Valor retornado ao selecionar
        columns: [ // Colunas exibidas no lookup
          { property: 'codigo_contaorcamentaria', label: 'Código' },
          { property: 'nome_contaorcamentaria', label: 'Nome' },
        ],
      },
      { property: 'cc', label: 'CC', required: true,
        searchService: this.lookupServiceCentroDeCusto,
        fieldLabel: 'codigo', // Nome da propriedade que será exibida no lookup
        fieldValue: 'codigo', // Nome da propriedade que será usada como valor
        columns: [ // Colunas exibidas no lookup
          { property: 'codigo', label: 'Código' },
          { property: 'descricao', label: 'Nome' },
        ],
      },
      { property: 'dataP', label: 'Data', type: 'date', required: true },
      { property: 'valor', label: 'Valor', type: 'number', required: true },
    ];

  // Detalhes do orçamento
  public orcamentoFields: PoDynamicViewField[] = [
    { property: 'codigo_orcamento', label: 'Código', gridColumns: 6 },
    // { property: 'empresa', label: 'Empresa', gridColumns: 6 },
    {
      property: 'descricao_orcamento',
      label: 'Descrição',
      gridColumns: 6,
      divider: 'Dados do Orçamento',
    },
    {
      property: 'periodo',
      label: 'Período',
      gridColumns: 6,
    },
    { property: 'dt_inicio', label: 'Data Início', type: 'date', gridColumns: 6, format: 'dd/MM/yyyy' },
    { property: 'dt_fim', label: 'Data Fim', type: 'date', gridColumns: 6, format: 'dd/MM/yyyy' },
    { property: 'numero_versao', label: 'Versão', gridColumns: 6 },
    { property: 'bloqueado', label: 'Bloqueado', gridColumns: 6 },
  ];

  // Campos para edição do orçamento
  public editFields: PoDynamicFormField[] = [
    { property: 'codigo_orcamento', label: 'Código', required: true, disabled: true },
    // {
    //   property: 'empresa',
    //   label: 'Empresa',
    //   type: 'string',
    //   placeholder: 'Selecione uma Empresa',
    //   required: true,
    //   gridColumns: 4,
    //   clean: true,
    //   maxLength: 3,
    //   searchService: this.lookupServiceEmpresas,
    //   fieldLabel: 'codigo', // Exibe apenas o código
    //   fieldValue: 'codigo', // Valor retornado ao selecionar
    //   columns: [ // Colunas exibidas no lookup
    //     { property: 'codigo', label: 'Código' },
    //     { property: 'razao_social', label: 'Razão Social' },
    //     { property: 'nome_fantasia', label: 'Nome Fanasia' },
    //   ],
    //   noAutocomplete: true,
    // },
    { property: 'descricao_orcamento', label: 'Descrição', required: true },
    {
      property: 'periodo',
      label: 'Período',
      disabled: true,
      placeholder: 'Mensal ou Anual',
      required: true,
      type: 'string',
      options: [
        { label: 'Mensal', value: 'Mensal' },
        { label: 'Anual', value: 'Anual' },
      ],
      forceOptionsComponentType: ForceOptionComponentEnum.select,
    },
    {
      property: 'dt_inicio',
      label: 'Data Início',
      type: 'date',
      required: true,
      validate: this.validateDates.bind(this) // Adiciona validação
    },
    { property: 'dt_fim', label: 'Data Final', type: 'date', required: true, validate: this.validateDates.bind(this) }, // Adiciona validação,
    {
      property: 'numero_versao',
      label: 'Versão',
      required: true,
      disabled: true,
    },
    {
      property: 'bloqueado',
      label: 'Bloqueado',
      placeholder: 'Sim ou Não',
      required: true,
      options: [
        { label: 'Não', value: 'nao' },
        { label: 'Sim', value: 'sim' },
      ],
      forceOptionsComponentType: ForceOptionComponentEnum.select,
      gridColumns: 4,
    },
  ];

  public itemColumns: PoTableColumn[] = [
    
    { property: 'item', label: 'Item', type: 'string' },
    { property: 'empresa', label: 'Empresa', type: 'string' },
    // { property: 'orcamento', label: 'Orçamento', type: 'string' },
    { property: 'conta', label: 'Conta', type: 'string' },
    { property: 'cc', label: 'CC', type: 'string' },
    { property: 'dataP', label: 'Período', type: 'date' },
    { property: 'valor', label: 'Valor', type: 'number' },
    {
      property: 'actions',
      label: 'Ações',
      type: 'icon',
      icons: [
        {
          action: this.editItem.bind(this),
          icon: 'po-icon-edit',
          tooltip: 'Editar',
          value: 'edit',
        },
        {
          action: this.removeItem.bind(this),
          icon: 'po-icon-delete',
          tooltip: 'Excluir',
          value: 'delete',
        },
      ],
      visible: this.isEditMode, // A coluna de ações só será visível no modo de edição
    },
  ];

  // Chamar o método para atualizar a visibilidade das colunas ao abrir os modais
  public openDetailUser(conta: any) {
    this.isEditMode = false;
    this.updateColumnsVisibility();
    this.descricao_orcamento = conta.descricao_orcamento;
    this.orcamentoData = conta;
  
    if (!this.orcamentoData.itens) {
      this.orcamentoData.itens = [];
    }
  
    this.userModalEl.open();
  }

  public openEditModal(conta: any) {
    this.isEditMode = true; // Está no modo de edição
    this.updateColumnsVisibility();
    this.editData = { ...conta }; // Copia os dados do orçamento para edição
    this.editModalEl.open();
  }

  // Método para atualizar a visibilidade das colunas
  public updateColumnsVisibility() {
    this.itemColumns = this.itemColumns.map((column) => {
      if (column.property === 'actions') {
        column.visible = this.isEditMode;
      }
      return column;
    });
  }

  // Método para obter a descrição da conta
  private getContaDescription(codigo: string): string {
    if (!this.orcamentoData.itens) return '';
    const item = this.orcamentoData.itens.find((i: any) => i.conta === codigo);
    return item ? item.contaDescription : ''; // Você precisará armazenar essa informação
  }

  // Método para obter a descrição do centro de custo
  private getCcDescription(codigo: string): string {
    if (!this.orcamentoData.itens) return '';
    const item = this.orcamentoData.itens.find((i: any) => i.cc === codigo);
    return item ? item.ccDescription : ''; // Você precisará armazenar essa informação
  }

  // Método de validação das datas
  private validateDates(property: string, value: any, formValue: any): string | null {
    if (!formValue.dt_inicio || !formValue.dt_fim) {
      return null; // Não valida se alguma das datas estiver vazia
    }

    const dataInicio = new Date(formValue.dt_inicio);
    const dataFim = new Date(formValue.dt_fim);

    if (dataFim < dataInicio) {
      return 'A data final não pode ser anterior à data de início';
    }

    return null; // Retorna null quando a validação é bem-sucedida
  }

  // Abrir modal para editar item
  public editItem(item: any) {
    if (this.editItemModal) {
      this.itemEditData = { ...item, 
        conta: { 
          codigo_contaorcamentaria: item.conta,
          nome_contaorcamentaria: this.getContaDescription(item.conta)
        },
        cc: {
          codigo: item.cc,
          descricao: this.getCcDescription(item.cc)
        }
      }; // Copia os dados do item para edição

      this.isEditingItem = true;
      this.editItemModal.open(); // Abre o modal de edição de item
    } else {
      console.error('Modal de edição de item não está definido.');
    }
  }

  // // Salvar edição do item
  // public saveItemEdit() {
  //   // Encontra o índice do item que está sendo editado
  //   const index = this.editData.itens.findIndex(
  //     (i: any) => i.item === this.itemEditData.item
  //   );

  //   // Se o item for encontrado, atualiza os dados
  //   if (index !== -1) {
  //     this.editData.itens[index] = { ...this.itemEditData }; // Atualiza o item na lista
  //   }

  //   // Fecha o modal de edição
  //   this.editItemModal.close();
  //   this.isEditingItem = false;
  // }

  // Salvar edição do item
  public saveItemEdit() {
    // Extrai apenas os códigos dos campos com searchService
    const itemToSave = {
      ...this.itemEditData,
      conta: this.itemEditData.conta?.codigo_contaorcamentaria || this.itemEditData.conta,
      cc: this.itemEditData.cc?.codigo || this.itemEditData.cc
    };

    // Encontra o índice do item que está sendo editado
    const index = this.editData.itens.findIndex(
      (i: any) => i.item === itemToSave.item
    );

    // Se o item for encontrado, atualiza os dados
    if (index !== -1) {
      this.editData.itens[index] = itemToSave;
    }

    // Fecha o modal de edição
    this.editItemModal.close();
    this.isEditingItem = false;
  }

  // Remover item da lista
  public removeItem(item: any) {
    this.editData.itens = this.editData.itens.filter((i: any) => i !== item);
  }


  // Abrir modal para adicionar novo item
  public openAddItemModal() {
    this.newItem = {}; // Limpa os dados do novo item
    this.addItemModal.open(); // Abre o modal de adição de item
  }

  // // Método para adicionar novo item à lista
  // public adicionarItem(novoItem: any) {
  //   if (!this.editData.itens) {
  //     this.editData.itens = []; // Inicializa a lista de itens se estiver vazia
  //   }

  //   // Adiciona o novo item à lista com as ações
  //   this.editData.itens.push({
  //     ...novoItem,
  //     actions: ['edit', 'delete'], // Adiciona as ações
  //   });

  //   // Fecha o modal de adição de item
  //   this.addItemModal.close();
  // }

  // Método para adicionar novo item à lista
  public adicionarItem(novoItem: any) {
    if (!this.editData.itens) {
      this.editData.itens = [];
    }

    // Formata os dados antes de adicionar
    const itemToAdd = {
      ...novoItem,
      conta: novoItem.conta?.codigo_contaorcamentaria || novoItem.conta,
      cc: novoItem.cc?.codigo || novoItem.cc,
      actions: ['edit', 'delete']
    };

    this.editData.itens.push(itemToAdd);
    this.addItemModal.close();
  }

  // Salvar edição do orçamento
  public saveEdit() {

    // Validação das datas
    const dataInicio = new Date(this.editData.dt_inicio);
    const dataFim = new Date(this.editData.dt_fim);

    if (dataFim < dataInicio) {
      this.notify.error('A data final não pode ser anterior à data de início!');
      return; // Interrompe a execução do método
    }

    // Incrementa a versão do orçamento em +1
    this.editData.numero_versao = (
      parseInt(this.editData.numero_versao, 10) + 1
    ).toString();

    const url = `${this.url}`; // URL sem o ID
    const payload = {
      id: this.editData.id, // Inclui o ID no payload
      ...this.editData, // Envia todos os dados do orçamento
    };

    console.log('URL da requisição:', url);
    console.log('Dados enviados:', payload);

    this.http.put(url, payload).subscribe({
      next: () => {
        this.notify.success('Orçamento atualizado com sucesso!');
        this.editModalEl.close();
        // this.pageOrcamentos.updateDataTable(); // Atualiza a tabela
        // this.loadData(); // Recarrega os dados após salvar
        window.location.reload(); // Recarrega a página inteira (não recomendado)
        // Força a atualização da tabela
        // this.url = `${
        //   environment.url
        // }/api/mock/orcamento?timestamp=${new Date().getTime()}`;
        // setTimeout(() => {
        //   this.url = `${environment.url}/api/mock/orcamento`; // Restaura a URL original
        // }, 100);
      },
      error: (error) => {
        console.error('Erro ao atualizar orçamento:', error);
        if (error.status === 404) {
          this.notify.error(
            'Orçamento não encontrado. Verifique o ID ou o endpoint.'
          );
        } else {
          this.notify.error(`Erro ao atualizar orçamento: ${error.message}`);
        }
      },
    });
  }
}
