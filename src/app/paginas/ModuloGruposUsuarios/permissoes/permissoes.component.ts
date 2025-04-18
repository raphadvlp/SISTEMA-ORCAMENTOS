import { Component } from '@angular/core';
import { PoAccordionModule, PoButtonModule, PoContainerModule, PoDividerModule, PoFieldModule, PoLookupColumn, PoNotificationService, PoPageModule, PoTableColumn, PoTableModule } from '@po-ui/ng-components';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ConfigService } from '@app/services/transformConfig.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-permissoes',
  standalone: true,
  imports: [PoPageModule, PoFieldModule, PoContainerModule, PoTableModule, PoButtonModule, CommonModule, PoDividerModule,
    PoAccordionModule,
    FormsModule
  ],
  templateUrl: './permissoes.component.html',
  styleUrls: ['./permissoes.component.css']
})
export class PermissoesComponent {
  urlGrupos = 'http://localhost:8000/api/mock/grupodeusuarios'; // URL para buscar grupos
  urlPermissoes = 'http://localhost:8000/api/mock/permissoes'; // URL para salvar permissões

  grupoSelecionado: any = null;
  permissoes: any[] = [];

  colunasPermissoes: PoTableColumn[] = [
    { property: 'submenu', label: 'Submenu' },
    { property: 'ler', label: 'Ler', type: 'boolean' },
    { property: 'criar', label: 'Criar', type: 'boolean' },
    { property: 'editar', label: 'Editar', type: 'boolean' },
    { property: 'excluir', label: 'Excluir', type: 'boolean' }
  ];

  colunasGrupos: PoLookupColumn[] = [
    { property: 'id', label: 'Código' },
    { property: 'name', label: 'Nome' },
]

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private poNotification: PoNotificationService
  ) {

    configService.setConfig('grupos-de-usuarios', 'id');
  }

  onGrupoSelecionado(grupoId: any) {
    console.log('ID do grupo retornado pelo po-lookup:', grupoId);

    if (!grupoId) {
      this.poNotification.warning('Grupo inválido selecionado.');
      return;
    }

    // Busca os dados completos do grupo na API
    this.http.get<any>(`${this.urlGrupos}`).subscribe({
      next: (response) => {
        console.log('Resposta da API:', response);

        // Verifica se a propriedade "items" existe e é um array
        if (!response || !Array.isArray(response.items)) {
          console.error('Resposta da API inválida:', response);
          this.poNotification.error('Erro ao buscar grupo. Resposta inválida da API.');
          return;
        }

        // Busca o grupo pelo ID
        const grupoEncontrado = response.items.find((g: any) => g.id === grupoId);

        if (!grupoEncontrado) {
          this.poNotification.warning('Grupo não encontrado.');
          return;
        }

        this.grupoSelecionado = grupoEncontrado;
        console.log('Grupo selecionado:', this.grupoSelecionado);
        this.carregarPermissoes();
      },
      error: (error) => {
        console.error('Erro ao buscar grupo na API:', error);
        this.poNotification.error('Erro ao buscar grupo.');
      }
    });
  }

  carregarPermissoes() {
    if (!this.grupoSelecionado || !this.grupoSelecionado.id) {
      this.poNotification.warning('Selecione um grupo válido para carregar permissões.');
      return;
    }

    // Busca o grupo completo na API
    this.http.get<any>(`${this.urlGrupos}`).subscribe({
      next: (response) => {
        console.log('Resposta da API ao carregar permissões:', response);

        // Verifica se a propriedade "items" existe e é um array
        if (!response || !Array.isArray(response.items)) {
          console.error('Resposta da API inválida:', response);
          this.poNotification.error('Erro ao carregar permissões. Resposta inválida da API.');
          return;
        }

        // Busca o grupo pelo ID
        const grupoEncontrado = response.items.find((g: any) => g.id === this.grupoSelecionado.id);

        if (!grupoEncontrado) {
          this.poNotification.warning('Grupo não encontrado ao carregar permissões.');
          return;
        }

        // Atualiza as permissões com as salvas na API ou inicializa com padrão
        this.permissoes = grupoEncontrado.permissoes && grupoEncontrado.permissoes.length > 0
          ? grupoEncontrado.permissoes
          : this.inicializarPermissoesPadrao();

        console.log('Permissões carregadas:', this.permissoes);
      },
      error: (error) => {
        console.error('Erro ao carregar permissões da API:', error);
        this.poNotification.error('Erro ao carregar permissões.');
      }
    });
  }

  // Método para inicializar permissões padrão
  inicializarPermissoesPadrao() {
    return [
      {
        menu: 'Cadastro',
        submenus: [
          { submenu: 'Empresa', ler: false, criar: false, editar: false, excluir: false }
        ]
      },
      {
        menu: 'Financeiro',
        submenus: [
          { submenu: 'Contas Orçamentárias', ler: false, criar: false, editar: false, excluir: false },
          { submenu: 'Orçamentos', ler: false, criar: false, editar: false, excluir: false },
          { submenu: 'Centro de Custo', ler: false, criar: false, editar: false, excluir: false }
        ]
      },
      {
        menu: 'Segurança',
        submenus: [
          { submenu: 'Usuários', ler: false, criar: false, editar: false, excluir: false },
          { submenu: 'Grupos de Usuários', ler: false, criar: false, editar: false, excluir: false },
          { submenu: 'Permissões', ler: false, criar: false, editar: false, excluir: false }
        ]
      }
    ];
  }

  salvarPermissoes() {
    if (!this.grupoSelecionado || !this.grupoSelecionado.id) {
      this.poNotification.warning('Selecione um grupo válido antes de salvar.');
      return;
    }

    const payload = {
      id: this.grupoSelecionado.id,
      name: this.grupoSelecionado.name,
      usuarios: this.grupoSelecionado.usuarios || [],
      permissoes: this.permissoes
    };

    // Realiza o PUT enviando o ID no corpo
    this.http.put(this.urlGrupos, payload).subscribe({
      next: () => {
        this.poNotification.success('Permissões salvas com sucesso!');
        // Atualiza as permissões sem recarregar a página
        this.carregarPermissoes();
      },
      error: (error) => {
        console.error('Erro ao salvar permissões:', error);
        this.poNotification.error('Erro ao salvar permissões.');
      }
    });
  }
}