import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  PoPageModule,
  PoDynamicFormField,
  PoDynamicModule,
  PoButtonModule,
  PoTableModule,
  PoFieldModule,
} from '@po-ui/ng-components';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PoPageModule,
    PoDynamicModule,
    PoButtonModule,
    PoTableModule,
    PoFieldModule,
  ],
})
export class ItemListComponent implements OnInit {
  lookupServiceContaOrcamentaria =
    'http://localhost:8000/api/mock/contaorcamentaria';
  lookupServiceCentroDeCusto = 'http://localhost:8000/api/mock/centrodecusto';

  // Campos do formulário dinâmico
  fields: PoDynamicFormField[] = [
    {
      property: 'item',
      label: 'Item',
      type: 'string',
      required: true,
      gridColumns: 2,
      disabled: true, // Torna o campo não editável
      // visible: false, // Oculta o campo no formulário
      noAutocomplete: true,
    },
    {
      property: 'orcamento',
      label: 'Orçamento',
      type: 'string',
      required: true,
      gridColumns: 2,
      placeholder: 'Código Orçamento',
      noAutocomplete: true,
    },
    {
      property: 'conta',
      label: 'Conta Orçamentária',
      type: 'string',
      required: true,
      gridColumns: 2,
      searchService: this.lookupServiceContaOrcamentaria,
      fieldLabel: 'nome_contaorcamentaria', // Exibe apenas o código
      fieldValue: 'nome_contaorcamentaria', // Valor retornado ao selecionar
      columns: [ // Colunas exibidas no lookup
        { property: 'codigo_contaorcamentaria', label: 'Código' },
        { property: 'nome_contaorcamentaria', label: 'Nome' },
      ],
      placeholder: 'Selecione uma conta',
      noAutocomplete: true,
    },
    {
      property: 'cc',
      label: 'Centro de Custo',
      type: 'string',
      required: true,
      gridColumns: 2,
      searchService: this.lookupServiceCentroDeCusto,
      fieldLabel: 'codigo', // Nome da propriedade que será exibida no lookup
      fieldValue: 'codigo', // Nome da propriedade que será usada como valor
      columns: [ // Colunas exibidas no lookup
        { property: 'codigo', label: 'Código' },
        { property: 'descricao', label: 'Nome' },
      ],
      placeholder: 'Código CC',
      noAutocomplete: true,
    },
    {
      property: 'dataP',
      label: 'Data',
      type: 'date',
      format: 'dd/MM/yyyy',
      required: true,
      gridColumns: 2,
      placeholder: '00/00/0000',
      noAutocomplete: true,
    },
    {
      property: 'valor',
      label: 'Valor',
      type: 'number',
      required: true,
      gridColumns: 2,
      // placeholder: '0,00',
      clean: true,
      noAutocomplete: true,
    },
  ];

  // Valores do formulário
  formValues: any = {};

  // Lista de itens
  items: any[] = [];
  orcamentoSalvo: any = null;

  // Índice do item sendo editado
  editingIndex: number | null = null;

  // Contador de sequência de itens
  itemSequence: number = 1;

  // Colunas da tabela
  columns = [
    { property: 'item', label: 'Item' },
    { property: 'orcamento', label: 'Orçamento' },
    { property: 'conta', label: 'Conta Orçamentária' },
    { property: 'cc', label: 'Centro de Custo' },
    { property: 'dataP', label: 'Data', type: 'date', format: 'dd/MM/yyyy' },
    { property: 'valor', label: 'Valor', type: 'number' },
  ];

  // Ações da tabela
  actions = [
    {
      action: this.excluirItem.bind(this),
      label: 'Excluir',
      icon: 'po-icon-delete',
    },
    {
      action: this.editarItem.bind(this),
      label: 'Editar',
      icon: 'po-icon-edit',
    },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.formValues.item = this.itemSequence;
  }

  // Método para capturar mudanças no formulário
  onFormChange(event: any) {
    if (event.property === 'conta' && event.value) {
      this.formValues.conta = event.value; // Atualiza o valor do campo 'conta'
    }
    if (event.property === 'cc' && event.value) {
      this.formValues.cc = event.value; // Atualiza o valor do campo 'cc'
    }
  }

  // Adicionar ou salvar item
  adicionarOuSalvarItem() {
    if (this.editingIndex !== null) {
      // Salvar edição
      this.items[this.editingIndex] = {
        ...this.formValues,
        actions: ['edit', 'delete'], // Adiciona as ações
      };
      this.editingIndex = null;
    } else {
      // Adicionar novo item
      this.items.push({
        ...this.formValues,
        actions: ['edit', 'delete'], // Adiciona as ações
      });
      this.itemSequence++; // Incrementar a sequência do próximo item
      this.formValues.item = this.itemSequence; // Atualizar o valor do campo item
    }

    // Limpa o formulário, exceto o campo item
    this.formValues.orcamento = '';
    this.formValues.conta = '';
    this.formValues.cc = '';
    this.formValues.dataP = '';
    this.formValues.valor = null;
  }

  // Excluir item
  excluirItem(item: any) {
    this.items = this.items.filter((i) => i !== item);
    console.log('Item excluído:', item); // Debug: Verifique se o item foi excluído
  }

  // Editar item
  editarItem(item: any) {
    this.editingIndex = this.items.indexOf(item);
    this.formValues = { ...item };
  }

  // Salvar orçamento
  salvarOrcamento() {
    this.orcamentoSalvo = {
      data: new Date().toISOString(),
      itens: this.items,
    };
    console.log('Orçamento salvo:', this.orcamentoSalvo); // Debug: Verifique o JSON salvo
  }
}
