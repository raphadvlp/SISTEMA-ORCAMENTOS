import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import {
  PoNotificationService,
  PoModalComponent,
  PoDynamicFormField,
  PoDynamicViewField,
  PoTableColumn,
  PoButtonModule,
  PoDividerModule,
  PoDynamicModule,
  PoModalModule,
  PoPageModule,
  PoTableModule,
} from '@po-ui/ng-components';
import {
  PoPageDynamicTableComponent,
  PoPageDynamicTableField,
  PoPageDynamicTableCustomAction,
  PoPageDynamicTableActions,
  PoPageDynamicTableModule,
} from '@po-ui/ng-templates';
import { environment } from '../../../../environments/environment';
import { ConfigService } from '../../../services/transformConfig.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-centrodecusto',
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
  templateUrl: './centrodecusto.component.html',
  styleUrl: './centrodecusto.component.css',
})
export class CentrodecustoComponent {
  title = 'Centro de Custo';

  @ViewChild('pageUsers') pageUsers!: PoPageDynamicTableComponent;
  @ViewChild('centroDeCustoDetailModal') userModalEl!: PoModalComponent;
  @ViewChild('editModal') editModalEl!: PoModalComponent;

  public itemEditData: any = {};
  public isEditingItem: boolean = false;

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
      property: 'descricao',
      label: 'Descrição',
      type: 'string',
      filter: true,
      allowColumnsManager: true,
    },
  ];

  public tableActions: PoPageDynamicTableCustomAction[] = [
    { label: 'Detalhes', action: this.openDetailUser.bind(this) },
    { label: 'Editar', action: this.openEditModal.bind(this) },
  ];

  public url: string = `${environment.url}/api/mock/centrodecusto`;

  public actions: PoPageDynamicTableActions = {
    new: '/novocentrodecusto',
    remove: true,
  };

  public descricao: string = '';

  public centroDeCustoFields: PoDynamicViewField[] = [
    { property: 'codigo', label: 'Código', gridColumns: 6 },
    { property: 'descricao', label: 'Descrição', gridColumns: 6 },
  ];

  public editFields: PoDynamicFormField[] = [
    { property: 'codigo', label: 'Código', required: true },
    { property: 'descricao', label: 'Descrição', required: true },
  ];

  public centroDeCustoData: any = {};
  public editData: any = {};

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private notify: PoNotificationService
  ) {
    configService.setConfig('centrodecusto', 'id');
  }

  public openDetailUser(conta: any) {
    this.descricao = conta.descricao;
    this.centroDeCustoData = conta;

    if (!this.centroDeCustoData.itens) {
      this.centroDeCustoData.itens = [];
    }

    this.userModalEl.open();
  }

  public openEditModal(conta: any) {
    this.editData = { ...conta }; // Copia os dados do centro de custo para edição
    this.editModalEl.open();
  }

  public saveEdit() {
    const url = `${this.url}`; // URL sem o ID
    const payload = {
      id: this.editData.id, // ID no payload
      codigo: this.editData.codigo,
      descricao: this.editData.descricao,
    };

    console.log('URL da requisição:', url);
    console.log('Dados enviados:', payload);

    this.http.put(url, payload).subscribe({
      next: () => {
        this.notify.success('Centro de Custo atualizado com sucesso!');
        this.editModalEl.close();
        window.location.reload(); // Recarrega a página
      },
      error: (error) => {
        console.error('Erro ao atualizar centro de custo:', error);
        if (error.status === 404) {
          this.notify.error(
            'Recurso não encontrado. Verifique o ID ou o endpoint.'
          );
        } else {
          this.notify.error(
            `Erro ao atualizar centro de custo: ${error.message}`
          );
        }
      },
    });
  }
}
