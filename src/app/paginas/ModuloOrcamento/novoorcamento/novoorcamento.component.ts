import { HttpClient } from '@angular/common/http';
import { Component, inject, ViewChild, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import {
  PoNotificationService,
  PoDynamicFormField,
  ForceOptionComponentEnum,
  PoModule,
} from '@po-ui/ng-components';
import { environment } from '../../../../environments/environment';
import { ItemListComponent } from '../../ModuloItensDoOrcamento/item-list/item-list.component';
import { Orcamento } from '../../../class/orcamento';

@Component({
  selector: 'app-novoorcamento',
  imports: [PoModule, ItemListComponent],
  templateUrl: './novoorcamento.component.html',
  styleUrls: ['./novoorcamento.component.css'],
})
export class NovoorcamentoComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(Router);
  private url: string = environment.url;
  private notify = inject(PoNotificationService);

  // Referência ao componente ItemListComponent
  @ViewChild(ItemListComponent) itemListComponent!: ItemListComponent;

  @Input() fields: PoDynamicFormField[] = [
    {
      property: 'codigo_orcamento',
      label: 'Código',
      type: 'number', // Define o tipo como number
      placeholder: 'Digite o código',
      required: true,
      gridColumns: 2,
      noAutocomplete: true,
      clean: true,
      maxLength: 10,
    },
    {
      property: 'descricao_orcamento',
      label: 'Descrição',
      type: 'string',
      placeholder: 'Digite a descrição do orçamento',
      required: true,
      gridColumns: 10,
      clean: true,
      noAutocomplete: true,
    },
    {
      property: 'periodo',
      label: 'Período',
      placeholder: 'Mensal ou Anual',
      type: 'string',
      options: [
        { label: 'Mensal', value: 'Mensal' },
        { label: 'Anual', value: 'Anual' },
      ],
      forceOptionsComponentType: ForceOptionComponentEnum.select,
      gridColumns: 2,
    },
    {
      property: 'dt_inicio',
      label: 'Data Início',
      type: 'date',
      format: 'mm/dd/yyyy',
      gridColumns: 2,
      placeholder: '00/00/0000',
      noAutocomplete: true,
    },
    {
      property: 'dt_fim',
      label: 'Data Final',
      type: 'date',
      format: 'mm/dd/yyyy',
      gridColumns: 2,
      placeholder: '00/00/0000',
      noAutocomplete: true,
    },
    {
      property: 'numero_versao',
      label: 'Versão',
      type: 'number',
      placeholder: 'Digite a versão',
      required: true,
      gridColumns: 2,
      clean: true,
      disabled: true, // Desabilita o campo
      noAutocomplete: true,
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

  // Valores do formulário
  public formOrcamento: any = {};

  // Contador de sequência de itens
  versaoSequence: number = 1;

  public isEditing: boolean = false; // Adiciona a propriedade isEditing

  ngOnInit() {
    // Inicializa o campo numero_versao com 1
    this.formOrcamento.numero_versao = this.versaoSequence;

    // Define um valor inicial para o campo 'periodo'
    this.formOrcamento.periodo = 'Mensal'; // Ou 'Anual', dependendo do caso

    // Define um valor inicial para o campo 'bloqueado'
    this.formOrcamento.bloqueado = 'Nao'; // Ou 'Anual', dependendo do caso

    // Verifica o valor inicial do campo periodo
    this.onPeriodoChange(this.formOrcamento.periodo);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fields']) {
      console.log('Fields alterados:', changes['fields'].currentValue);
    }
  }

  ngDoCheck() {
    // Verifica se o valor do campo 'periodo' mudou
    const periodo = this.formOrcamento.periodo;
  
    if (periodo) {
      // Chama o método onPeriodoChange para atualizar o estado do campo 'dt_inicio'
      this.onPeriodoChange(periodo);
    }
  }


  onPeriodoChange(periodo: string) {
    console.log('Período alterado para:', periodo);
  
    // Encontra o campo 'dt_inicio'
    const dtInicioField = this.fields.find((field) => field.property === 'dt_inicio');
  
    if (dtInicioField) {
      // Define o campo como desabilitado se o período for 'Anual', caso contrário, habilita
      dtInicioField.disabled = periodo === 'Anual';
    }

    // Se o período for 'Anual', limpa o valor do campo 'dt_inicio'
    if (periodo === 'Anual') {
      this.formOrcamento.dt_inicio = null; // ou '' dependendo do que você preferir
    }
  
    // Atualiza o array de campos para forçar a detecção de mudanças
    this.fields = [...this.fields];
  }

  // Método para lidar com mudanças no formulário
  onFormChange(event: any) {
    if (event.property === 'periodo') {
      this.onPeriodoChange(event.value);
    }

    //Não está funcionando
    if (event.property === 'codigo_orcamento') {
      this.onCodigoChange(event.value);
    }
  }

  onCodigoChange(codigo: string) {
    console.log('Código alterado para:', codigo);
  
    // Atualiza o campo 'código_orcamento' no item da lista
    if (this.itemListComponent && this.itemListComponent.items.length > 0) {
      this.itemListComponent.items.forEach((item) => {
        item.codigo_orcamento = codigo;
      });
    }
  
    // Log para depuração
    console.log('Itens atualizados:', this.itemListComponent.items);
  }

  public confirmarForm(form: any) {
    // Verifica se há itens na lista
    if (this.itemListComponent.items.length === 0) {
      this.notify.warning({
        duration: 2000,
        message: 'Adicione pelo menos um item ao orçamento.',
      });
      return;
    }

    // Adiciona zeros à esquerda se o código tiver menos de 10 dígitos
    form.codigo_orcamento = form.codigo_orcamento.toString().padStart(10, '0');

    // Converte o valor do campo descricao_orcamento para uppercase
    form.descricao_orcamento = form.descricao_orcamento.toUpperCase();

    // Prepara o payload do orçamento com os itens
    const payload = {
      ...form, // Dados do formulário (cabeçalho do orçamento)
      itens: this.itemListComponent.items, // Lista de itens
    };

    // Log para depuração
    console.log('Payload do orçamento:', payload);

    // Salvar o orçamento com os itens
    this.http.post<any>(`${this.url}/api/mock/orcamento`, payload).subscribe({
      next: (response) => {
        this.isEditing = true;
        this.notify.success({
          duration: 2000,
          message: 'Orçamento e itens cadastrados com sucesso.',
        });

        // Incrementa o valor do campo numero_versao apenas se estiver editando
        if (this.isEditing) {
          this.formOrcamento.numero_versao = (
            parseInt(this.formOrcamento.numero_versao) + 1
          ).toString();
        }

        // Navega para a lista de orçamentos
        this.route.navigate(['/orcamentos']);
      },
      error: (error) => {
        this.notify.error({
          duration: 2000,
          message: `Erro ao salvar orçamento: ${error.message}`,
        });
      },
    });
  }
}
