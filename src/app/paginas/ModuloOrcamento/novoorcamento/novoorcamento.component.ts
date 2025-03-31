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

  // Valores do formulário
  public formOrcamento: any = {};

  // Contador de sequência de itens
  public versaoSequence: number = 1;

  public isEditing: boolean = false; // Adiciona a propriedade isEditing

  // Controle do período
  public periodoAtual: string = 'Mensal';
  
  currentMonthName = new Date().toLocaleDateString('pt-BR', { month: 'long' });
  lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate().toString().padStart(2, '0');
  currentYear = new Date().getFullYear();

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
      format: 'dd/mm/yyyy',
      gridColumns: 3,
      placeholder: '00/00/0000',
      noAutocomplete: true,
      errorMessage: 'Selecione uma data do mês atual' // Mensagem padrão de erro
    },
    {
      property: 'dt_fim',
      label: 'Data Final',
      type: 'date',
      format: 'dd/mm/yyyy',
      gridColumns: 3,
      placeholder: '00/00/0000',
      noAutocomplete: true,
      errorMessage: 'Selecione uma data do mês atual' // Mensagem padrão de erro
    },
    {
      property: 'numero_versao',
      label: 'Versão',
      type: 'number',
      placeholder: 'Digite a versão',
      required: true,
      gridColumns: 1,
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
      gridColumns: 3,
    },
  ];

  validateCurrentMonth(date: string | Date): boolean {
    if (!date) return false;
    
    const selectedDate = new Date(date);
    const today = new Date();
    
    // Se o período for anual, validar apenas mês e ano
    if (this.periodoAtual === 'Anual') {
      return selectedDate.getFullYear() === today.getFullYear();
    }
    
    // Para período mensal, validar mês, ano e dia
    return (
      selectedDate.getMonth() === today.getMonth() && 
      selectedDate.getFullYear() === today.getFullYear()
    );
}

  validateBothDatesForMonthlyPeriod(): boolean {
    if (this.periodoAtual !== 'Mensal') return true;
    
    const validStart = this.validateCurrentMonth(this.formOrcamento.dt_inicio);
    const validEnd = this.validateCurrentMonth(this.formOrcamento.dt_fim);
    
    return validStart && validEnd;
  }

  ngOnInit() {
    // Inicializa o campo numero_versao com 1
    this.formOrcamento.numero_versao = this.versaoSequence;

    // Define um valor inicial para o campo 'periodo'
    this.formOrcamento.periodo = 'Mensal';

    // Define um valor inicial para o campo 'bloqueado'
    this.formOrcamento.bloqueado = 'nao';
    
    // Formata a data inicial corretamente para o PO UI
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/` +
                         `${(today.getMonth() + 1).toString().padStart(2, '0')}/` +
                         `${today.getFullYear()}`;
    
    this.formOrcamento.dt_inicio = formattedDate;
    
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
    this.periodoAtual = periodo;
  
    const dtInicioField = this.fields.find(f => f.property === 'dt_inicio');
    const dtFimField = this.fields.find(f => f.property === 'dt_fim');
  
    if (periodo === 'Mensal') {
      // Configuração para data início
      if (dtInicioField) {
        dtInicioField.disabled = false;
        dtInicioField.validate = (value: any) => ({
          valid: this.validateCurrentMonth(value),
          errorMessage: 'Data início deve ser do mês atual'
        });
        this.formOrcamento.dt_inicio = new Date().toISOString().split('T')[0];
      }
  
      // Configuração para data fim
      if (dtFimField) {
        dtFimField.disabled = false;
        dtFimField.validate = (value: any) => ({
          valid: this.validateCurrentMonth(value),
          errorMessage: 'Data final deve ser do mês atual'
        });
        this.formOrcamento.dt_fim = new Date().toISOString().split('T')[0];
      }
    } else {
      // Configuração para período anual
      if (dtInicioField) {
        dtInicioField.disabled = false; // Alterado para false para permitir edição
        dtInicioField.validate = (value: any) => ({
          valid: this.validateCurrentMonth(value),
          errorMessage: 'Data início deve ser do ano atual' // Mensagem atualizada
        });
        // Define a data inicial como primeiro dia do ano atual
        const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
        this.formOrcamento.dt_inicio = firstDayOfYear.toISOString().split('T')[0];
      }
      if (dtFimField) {
        dtFimField.disabled = false; // Alterado para false para permitir edição
        dtFimField.validate = (value: any) => ({
          valid: this.validateCurrentMonth(value),
          errorMessage: 'Data final deve ser do ano atual' // Mensagem atualizada
        });
        // Define a data final como último dia do ano atual
        const lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);
        this.formOrcamento.dt_fim = lastDayOfYear.toISOString().split('T')[0];
      }
    }
  
    this.fields = [...this.fields];
  
    if (periodo === 'Anual' && this.itemListComponent?.items.length > 1) {
      this.notify.warning({
        duration: 3000,
        message: 'Período anual permite apenas 1 item. Itens anteriores foram removidos.'
      });
      this.itemListComponent.items = [this.itemListComponent.items[0]];
      this.itemListComponent.itemSequence = 2;
    }
  }

  // Método para lidar com mudanças no formulário
  onFormChange(event: any) {
    if (event.property === 'periodo') {
      this.onPeriodoChange(event.value);
    }

    //  //Não está funcionando
    // if (this.periodoAtual === 'Mensal') {
    //   if (event.property === 'dt_inicio' && !this.validateCurrentMonth(event.value)) {
    //     this.notify.warning({
    //       duration: 2000,
    //       message: 'Data início deve ser do mês atual!'
    //     });
    //   }
      
    //   if (event.property === 'dt_fim' && !this.validateCurrentMonth(event.value)) {
    //     this.notify.warning({
    //       duration: 2000,
    //       message: 'Data final deve ser do mês atual!'
    //     });
    //   }
    // }
    
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

  //   // Método para obter a data mínima (primeiro dia do mês atual)
  // getMinDateForPeriod(): Date {
  //   const today = new Date();
  //   return new Date(today.getFullYear(), today.getMonth(), 1);
  // }

  // // Método para obter a data máxima (último dia do mês atual)
  // getMaxDateForPeriod(): Date {
  //   const today = new Date();
  //   return new Date(today.getFullYear(), today.getMonth() + 1, 0);
  // }

  public confirmarForm(form: any) {
    // Validação para período mensal
    if (this.periodoAtual === 'Mensal') {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
  
      const startDate = new Date(form.dt_inicio);
      const endDate = form.dt_fim ? new Date(form.dt_fim) : null;
  
      // if (!this.validateCurrentMonth(form.dt_inicio)) {
      //   this.notify.error({
      //     duration: 3000,
      //     message: `A data inicial deve ser do mês atual (${this.currentMonthName}/${this.currentYear})`
      //   });
      //   return;
      // }
  
      // if (endDate && !this.validateCurrentMonth(form.dt_fim)) {
      //   this.notify.error({
      //     duration: 3000,
      //     message: `A data final deve ser do mês atual (${this.currentMonthName}/${this.currentYear})`
      //   });
      //   return;
      // }
  
      if (endDate && startDate > endDate) {
        this.notify.error({
          duration: 3000,
          message: 'A data final não pode ser anterior à data inicial'
        });
        return;
      }
    }
    
    // Validação para período anual
    if (this.periodoAtual === 'Anual') {
      const today = new Date();
      const currentYear = today.getFullYear();
  
      const startDate = new Date(form.dt_inicio);
      const endDate = form.dt_fim ? new Date(form.dt_fim) : null;
  
      // if (startDate.getFullYear() !== currentYear) {
      //   this.notify.error({
      //     duration: 3000,
      //     message: `A data inicial deve ser do ano atual (${currentYear})`
      //   });
      //   return;
      // }
  
      // if (endDate && endDate.getFullYear() !== currentYear) {
      //   this.notify.error({
      //     duration: 3000,
      //     message: `A data final deve ser do ano atual (${currentYear})`
      //   });
      //   return;
      // }
  
      if (endDate && startDate > endDate) {
        this.notify.error({
          duration: 3000,
          message: 'A data final não pode ser anterior à data inicial'
        });
        return;
      }
    }

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