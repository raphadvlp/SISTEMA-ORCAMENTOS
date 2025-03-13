import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoDynamicFormField,
  PoDynamicModule,
  PoFieldModule,
  PoTableModule,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-adicionaritenorcamento',
  imports: [
    CommonModule,
    FormsModule,
    PoDynamicModule,
    PoButtonModule,
    PoTableModule,
    PoFieldModule,
  ],
  templateUrl: './adicionaritenorcamento.component.html',
  styleUrl: './adicionaritenorcamento.component.css',
})
export class AdicionaritenorcamentoComponent {
  @Output() itemAdicionado = new EventEmitter<any>();

  // Campos do formulário dinâmico
  fields: PoDynamicFormField[] = [
    {
      property: 'item',
      label: 'Item',
      type: 'string',
      required: true,
      gridColumns: 6, // Ocupa 6 colunas (metade da linha)
      gridSmColumns: 12, // Em telas pequenas, ocupa 12 colunas (linha inteira)
      disabled: true,
      noAutocomplete: true,
    },
    {
      property: 'orcamento',
      label: 'Orçamento',
      type: 'string',
      required: true,
      gridColumns: 6, // Ocupa 6 colunas (metade da linha)
      gridSmColumns: 12, // Em telas pequenas, ocupa 12 colunas (linha inteira)
      placeholder: 'Código Orçamento',
      noAutocomplete: true,
    },
    {
      property: 'conta',
      label: 'Conta Orçamentária',
      type: 'string',
      required: true,
      gridColumns: 6, // Ocupa 6 colunas (metade da linha)
      gridSmColumns: 12, // Em telas pequenas, ocupa 12 colunas (linha inteira)
      searchService: 'http://localhost:8000/api/mock/contaorcamentaria',
      fieldLabel: 'codigo_contaorcamentaria',
      fieldValue: 'codigo_contaorcamentaria',
      placeholder: 'Código Conta Orçamentária',
      noAutocomplete: true,
    },
    {
      property: 'cc',
      label: 'Centro de Custo',
      type: 'string',
      required: true,
      gridColumns: 6, // Ocupa 6 colunas (metade da linha)
      gridSmColumns: 12, // Em telas pequenas, ocupa 12 colunas (linha inteira)
      searchService: 'http://localhost:8000/api/mock/centrodecusto',
      fieldLabel: 'codigo',
      fieldValue: 'codigo',
      placeholder: 'Código CC',
      noAutocomplete: true,
    },
    {
      property: 'dataP',
      label: 'Data',
      type: 'date',
      format: 'dd/MM/yyyy',
      required: true,
      gridColumns: 6, // Ocupa 6 colunas (metade da linha)
      gridSmColumns: 12, // Em telas pequenas, ocupa 12 colunas (linha inteira)
      placeholder: '00/00/0000',
      noAutocomplete: true,
    },
    {
      property: 'valor',
      label: 'Valor',
      type: 'number',
      required: true,
      gridColumns: 6, // Ocupa 6 colunas (metade da linha)
      gridSmColumns: 12, // Em telas pequenas, ocupa 12 colunas (linha inteira)
      clean: true,
      noAutocomplete: true,
    },
  ];

  // Valores do formulário
  formValues: any = {};

  // Contador de sequência de itens
  itemSequence: number = 1;

  constructor() {
    this.formValues.item = this.itemSequence;
  }

  // Método para capturar mudanças no formulário
  onFormChange(event: any) {
    if (event.property === 'conta' && event.value) {
      this.formValues.conta = event.value;
    }
    if (event.property === 'cc' && event.value) {
      this.formValues.cc = event.value;
    }
  }

  // Adicionar ou salvar item
  adicionarOuSalvarItem() {
    const novoItem = { ...this.formValues };
    this.itemAdicionado.emit(novoItem); // Emite o novo item para o componente pai

    // Limpa o formulário, exceto o campo item
    this.formValues.orcamento = '';
    this.formValues.conta = '';
    this.formValues.cc = '';
    this.formValues.dataP = '';
    this.formValues.valor = null;

    // Incrementa a sequência do próximo item
    this.itemSequence++;
    this.formValues.item = this.itemSequence;
  }
}
