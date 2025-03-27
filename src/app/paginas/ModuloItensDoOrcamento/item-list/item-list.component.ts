import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
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

import { BrCurrencyPipe } from './br-currency.pipe';

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

  lookupServiceContaOrcamentaria = `${environment.url}/api/mock/contaorcamentaria`;
  lookupServiceCentroDeCusto = `${environment.url}/api/mock/centrodecusto`;

  // lookupServiceContaOrcamentaria =
  //   'http://localhost:8000/api/mock/contaorcamentaria';
  // lookupServiceCentroDeCusto = 'http://localhost:8000/api/mock/centrodecusto';

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
      disabled: false,
    },
    {
      property: 'conta',
      label: 'Conta Orçamentária',
      type: 'string',
      required: true,
      gridColumns: 2,
      disabled: false,
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
      disabled: false,
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
      disabled: false,
      gridColumns: 2,
      placeholder: '00/00/0000',
      noAutocomplete: true,
    },
    {
      property: 'valor',
      label: 'Valor',
      type: 'number',
      required: true,
      disabled: false,
      gridColumns: 2,
      // placeholder: '0,00',
      clean: true,
      noAutocomplete: true,
      decimalsLength: 2, // Duas casas decimais
      thousandMaxlength: 3, // Separador de milhar
      icon: 'po-icon-money' // Ícone de moeda
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

  // Propriedade para receber o período
  @Input() periodo: string = 'Mensal';

  

  // Colunas da tabela
  columns = [
    { property: 'item', label: 'Item' },
    { property: 'orcamento', label: 'Orçamento' },
    { property: 'conta', label: 'Conta Orçamentária' },
    { property: 'cc', label: 'Centro de Custo' },
    { property: 'dataP', label: 'Data', type: 'date', format: 'dd/MM/yyyy' },
    { 
      property: 'valor', 
      label: 'Valor', 
      type: 'number',
      format: '1.2-2', // Formato Angular - mínimo 1 dígito antes e 2 depois da vírgula
      // pipe: {
      //   property: 'valor',
      //   format: 'BRL' // Formato de moeda brasileira (R$)
      // }
      pipe: new BrCurrencyPipe() // Usa o pipe programaticamente
    },
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

  // Método chamado quando qualquer input mudar
  ngOnChanges(changes: SimpleChanges) {
    if (changes['periodo']) {
      this.atualizarEstadoCampos();
    }
  }


  // Método para atualizar o estado dos campos
  atualizarEstadoCampos() {
    const camposParaDesabilitar = ['orcamento', 'conta', 'cc', 'dataP', 'valor'];
    const deveDesabilitar = this.periodo === 'Anual' && this.items.length >= 1;

    this.fields = this.fields.map(field => {
      if (camposParaDesabilitar.includes(field.property)) {
        return {
          ...field,
          disabled: deveDesabilitar
        };
      }
      return field;
    });
  }

  // Adicionar ou salvar item
  // AdicionarOuSalvarItem para chamando atualizarEstadoCampos
  adicionarOuSalvarItem() {
    if (this.periodo === 'Anual' && this.items.length >= 1 && this.editingIndex === null) {
      alert('Período anual permite apenas 1 item. Não é possível adicionar mais itens.');
      return;
    }
  
    // Formata o valor antes de adicionar
    const valorFormatado = this.formValues.valor ?
      parseFloat(this.formValues.valor).toFixed(2) :
      null;
  
    if (this.editingIndex !== null) {
      this.items[this.editingIndex] = {
        // Salvar edição
        ...this.formValues,
        valor: valorFormatado,
        // Adiciona as ações
        actions: ['edit', 'delete'],
      };
      this.editingIndex = null;
    } else {
      this.items.push({
        ...this.formValues,
        valor: valorFormatado,
        actions: ['edit', 'delete'],
      });

      // Incrementar a sequência do próximo item
      this.itemSequence++;

      // Atualizar o valor do campo item
      this.formValues.item = this.itemSequence;
    }
  
    // Limpa o formulário
    this.formValues.orcamento = '';
    this.formValues.conta = '';
    this.formValues.cc = '';
    this.formValues.dataP = '';
    this.formValues.valor = null;
  
    // Atualiza o estado dos campos após adicionar/editar
    this.atualizarEstadoCampos();
  }

  // Modifique o excluirItem para chamar atualizarEstadoCampos
  excluirItem(item: any) {
    this.items = this.items.filter((i) => i !== item);
    this.atualizarEstadoCampos(); // Atualiza o estado dos campos após exclusão
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
