import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  PoAccordionModule, 
  PoButtonModule, 
  PoPageModule, 
  PoTableModule,
  PoLoadingModule,
  PoModalComponent,
  PoNotificationService,
  PoDividerModule,
  PoFieldModule,
  PoModalModule,
  PoDialogService,
  PoTooltipModule,
  PoContainerModule
} from '@po-ui/ng-components';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from 'environments/environment';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '@app/services/transformConfig.service';
import { PoPageDynamicTableField, PoPageDynamicTableModule } from '@po-ui/ng-templates';

interface Usuario {
  username: string;
  email: string;
  department: string;
  // Adicione esta propriedade para as ações
  actions?: string;
}

interface Grupo {
  id: string;
  name: string;
  usuarios: Usuario[];
}

interface ApiResponse {
  version: number;
  title: string;
  items: Grupo[];  // Agora usando 'items' em vez de 'data'
  hasNext: boolean;
  page_size: number;
  keepFilters?: boolean;
}

interface GrupoPayload {
  id: string;
  name: string;
  usuarios: {
    department: string;
    name: string;
  }[];
}

@Component({
  selector: 'app-grupos-de-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    PoAccordionModule,
    PoButtonModule,
    PoPageModule,
    PoTableModule,
    PoLoadingModule,
    RouterModule,
    PoDividerModule,
    PoFieldModule,
    PoModalModule,
    FormsModule,
    PoTooltipModule,
    PoPageDynamicTableModule,
    PoContainerModule
  ],
  templateUrl: './grupos-de-usuarios.component.html',
  styleUrls: ['./grupos-de-usuarios.component.css']
})
export class GruposDeUsuariosComponent {

  public url: string = `${environment.url}/api/mock/grupodeusuarios`;

  grupos: Grupo[] = [];
  loading = true;
  errorMessage = '';
  salvando: boolean = false; // Adicione esta linha
  excluindo: boolean = false;

  public grupoEmEdicao: any;
  public nomeEditado: string = '';
  public usuariosEditados: any[] = [];
  // novoUsuario: any = { name: '', department: '' };
  novoUsuario: any = { username: '' };

  // Referência para o modal
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;



  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private router: Router,
    private poNotification: PoNotificationService,
    private poDialog: PoDialogService,
  ) {

    configService.setConfig('grupos-de-usuarios', 'id');
  }

  ngOnInit() {
    this.carregarGrupos();
  }


    // No seu componente TS
    colunasTabelaUsuarios = [
      { property: 'username', label: 'Usuário' },
    ];

    loadUsuarios(grupo: any, params: any = {}) {
      // Retorna os usuários do grupo diretamente (já temos os dados)
      return of({
        items: grupo.usuarios,
        hasNext: false,
        total: grupo.usuarios.length
      });
    }

  // Colunas para a tabela de usuários
  colunasLookupUsuario = [
    { property: 'username', label: 'Usuário' },
    { property: 'email', label: 'E-mail' },
    { property: 'department', label: 'Departamento' }
  ];

  carregarGrupos() {
    this.loading = true;
    console.log('Iniciando carregamento...');
  
    this.http.get<any>('http://localhost:8000/api/mock/grupodeusuarios')
      .pipe(
        tap(response => console.log('Resposta bruta:', response)),
        map(response => {
          // Extrai os itens da resposta corretamente
          const grupos = response.items || response.data || [];
          console.log('Grupos extraídos:', grupos);
          return grupos;
        }),
        catchError(error => {
          console.error('Erro na requisição:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (grupos) => {
          this.grupos = grupos;
          console.log('Grupos atribuídos:', this.grupos);
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro no subscribe:', error);
          this.loading = false;
        }
      });
  }

  preencherDadosUsuario(usuarioSelecionado: any) {
    if (usuarioSelecionado) {
      this.novoUsuario = {
        username: usuarioSelecionado.username,
        email: usuarioSelecionado.email,
        department: usuarioSelecionado.department
      };
    }
  }

  // Métodos para edição
  editarGrupo(grupo: any) {
    this.grupoEmEdicao = { ...grupo };
    this.nomeEditado = grupo.name;
    this.usuariosEditados = grupo.usuarios.map((u: any) => ({ ...u })); // Cópia profunda
    this.novoUsuario = { username: '' };
    this.poModal.open();
  }

  adicionarUsuario() {
    if (this.novoUsuario.username) {
      // Aqui você precisa garantir que está adicionando todos os campos necessários
      const usuarioCompleto = {
        username: this.novoUsuario.username,
        email: this.novoUsuario.email || '', // Adicione valor padrão se não existir
        department: this.novoUsuario.department || '' // Adicione valor padrão se não existir
      };
      this.usuariosEditados.push(usuarioCompleto);
      this.novoUsuario = { username: '' }; // Reset apenas do username para nova busca
    }
  }

  removerUsuario(index: number) {
    this.poDialog.confirm({
      title: 'Confirmar remoção',
      message: `Deseja remover o usuário ${this.usuariosEditados[index].username} do grupo?`,
      confirm: () => {
        this.usuariosEditados.splice(index, 1);
        this.poNotification.success('Usuário removido do grupo!');
      }
    });
  }

  removerUsuarioDoGrupo(usuario: any, grupo: any) {
    this.poDialog.confirm({
      title: 'Confirmar remoção',
      message: `Deseja remover o usuário ${usuario.username} do grupo ${grupo.name}?`,
      confirm: () => {
        // Encontra o índice do usuário no grupo
        const index = grupo.usuarios.findIndex((u: any) => u.username === usuario.username);
        
        if (index !== -1) {
          // Remove localmente para feedback imediato
          grupo.usuarios.splice(index, 1);
          
          // Atualiza no servidor
          this.atualizarGrupoNoServidor(grupo);
        }
      }
    });
  }

  
  atualizarGrupoNoServidor(grupo: any) {
    const url = `http://localhost:8000/api/mock/grupodeusuarios/${grupo.id}`;
    
    this.http.put(url, grupo)
      .subscribe({
        next: () => {
          this.poNotification.success('Grupo atualizado com sucesso!');
        },
        error: (error) => {
          this.poNotification.error('Erro ao atualizar grupo');
          // Recarrega os dados para sincronizar com o servidor
          this.carregarGrupos();
        }
      });
  }

  abrirEdicao(grupo: any) {
    this.grupoEmEdicao = { ...grupo };
    this.nomeEditado = grupo.name;
    this.usuariosEditados = [...grupo.usuarios];
    this.poModal.open();
  }
  

  public salvarEdicao() {
    // URL base sem o ID no final
    const url = 'http://localhost:8000/api/mock/grupodeusuarios';

    if (!this.nomeEditado) {
      this.poNotification.error('O nome do grupo é obrigatório!');
      return;
    }
    
    // Payload com todos os dados necessários
    const payload = {
      id: this.grupoEmEdicao.id,
      name: this.nomeEditado,
      usuarios: this.usuariosEditados.map(usuario => ({
        username: usuario.username,
        email: usuario.email || '', // Garantir que existe
        department: usuario.department || '' // Garantir que existe
      }))
    };

    this.salvando = true;

    console.log('URL da requisição:', url);
    console.log('Dados enviados:', payload);

    this.http.put(url, payload).subscribe({
      next: () => {
        this.poNotification.success('Grupo de usuários atualizado com sucesso!');
        this.poModal.close();
        this.carregarGrupos(); // Método para recarregar os dados (melhor que window.location.reload())
      },
      error: (error) => {
        console.error('Erro ao atualizar grupo:', error);
        if (error.status === 404) {
          this.poNotification.error('Grupo não encontrado. Verifique o ID.');
        } else if (error.status === 400) {
          this.poNotification.error('Dados inválidos. Verifique as informações.');
        } else {
          this.poNotification.error(`Erro ao atualizar grupo: ${error.message}`);
        }
      },
      complete: () => {
        this.salvando = false;
      }
    });
  }

  deveDesabilitarExclusao(grupo: any): boolean {
    // Desabilita apenas se estiver em processo de exclusão
    return this.excluindo;
  }

  confirmarExclusao(grupo: any) {

    console.log('Grupo selecionado para exclusão:', {
      id: grupo.id,
      name: grupo.name,
      usuarios: grupo.usuarios.length
    });

    const message = grupo.usuarios.length > 0
      ? `ATENÇÃO: O grupo "${grupo.name}" contém ${grupo.usuarios.length} usuários. Todos serão removidos. Deseja continuar?`
      : `Deseja excluir o grupo "${grupo.name}"?`;
  
    this.poDialog.confirm({
      title: 'Confirmar exclusão',
      message: message,
      confirm: () => this.excluirGrupo(grupo.id)
    });
  }
  
  excluirGrupo(id: string) {
    // Validação reforçada
    if (!id || id.includes('N/A') || id.startsWith('temp-')) {
      this.poNotification.warning(`
        Grupos temporários ou com ID inválido 
        não podem ser excluídos permanentemente.
        ID recebido: ${id}
      `);
      // Remove apenas localmente se for temporário
      if (id.startsWith('temp-')) {
        this.grupos = this.grupos.filter(g => g.id !== id);
      }
      return;
    }
  
    const url = `http://localhost:8000/api/mock/grupodeusuarios/${id}`;
    
    this.http.delete(url).subscribe({
      next: () => {
        this.poNotification.success('Grupo excluído permanentemente!');
        this.grupos = this.grupos.filter(g => g.id !== id);
      },
      error: error => {
        console.error('Falha na exclusão:', error);
        this.poNotification.error(`
          Falha ao excluir grupo ID ${id}.
          ${error?.message || ''}
        `);
      }
    });
  }

}
