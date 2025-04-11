import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  PoPageModule, 
  PoNotificationService, 
  PoFieldModule,
  PoPageAction,
  PoMenuModule,
  PoLoadingModule,
  PoModule,
  PoButtonModule,
  PoTooltipModule
} from '@po-ui/ng-components';
import { environment } from 'environments/environment';

interface UsuarioFormGroup extends FormGroup {
  value: {
    username: string;
    email: string;
    department: string;
  };
}

@Component({
  selector: 'app-novogrupo',
  standalone: true,
  imports: [    
    CommonModule,
    FormsModule,
    PoPageModule,
    PoPageModule,
    PoMenuModule,
    PoLoadingModule,
    PoButtonModule,
    PoFieldModule,
    PoTooltipModule
  ],
  templateUrl: './novogrupo.component.html',
  styleUrls: ['./novogrupo.component.css']
})
export class NovogrupoComponent implements OnInit {
  public readonly actions: PoPageAction[] = [
    { label: 'Cancelar', action: this.cancelar.bind(this) },
    { label: 'Salvar', action: this.salvarGrupo.bind(this), disabled: () => !this.nomeGrupo || this.carregandoId }
  ];

  nomeGrupo: string = '';
  id: string = 'Gerando ID...';
  salvando: boolean = false;
  carregandoId: boolean = true;
  private ultimoIdNumero: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private poNotification: PoNotificationService
  ) {}

  ngOnInit() {
    this.obterUltimoId();
  }

  obterUltimoId() {
    this.carregandoId = true;
    this.http.get<{items: any[]}>(`${environment.url}/api/mock/grupodeusuarios`)
      .subscribe({
        next: (response) => {
          if (response.items && response.items.length > 0) {
            // Encontra o maior ID numérico existente
            const idsNumericos = response.items
              .map(grupo => this.extrairNumeroId(grupo.id))
              .filter(num => !isNaN(num));
            
            this.ultimoIdNumero = Math.max(...idsNumericos, 0);
          }
          this.gerarNovoId();
          this.carregandoId = false;
        },
        error: (error) => {
          console.error('Erro ao obter grupos:', error);
          // Se falhar, gera ID sequencial começando de 1
          this.ultimoIdNumero = 0;
          this.gerarNovoId();
          this.carregandoId = false;
          this.poNotification.warning('Gerando ID sequencial local');
        }
      });
  }

  private extrairNumeroId(id: string): number {
    const match = id.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  private gerarNovoId() {
    this.ultimoIdNumero++;
    this.id = `${this.ultimoIdNumero.toString()}`;
  }

  cancelar() {
    this.router.navigate(['../grupos-de-usuarios']);
  }

  salvarGrupo() {
    if (!this.nomeGrupo) {
      this.poNotification.error('O nome do grupo é obrigatório!');
      return;
    }

    this.salvando = true;

    const novoGrupo = {
      id: this.id,
      name: this.nomeGrupo,
      usuarios: []
    };

    this.http.post(`${environment.url}/api/mock/grupodeusuarios`, novoGrupo)
      .subscribe({
        next: () => {
          this.poNotification.success(`Grupo ${this.id} criado com sucesso!`);
          this.router.navigate(['../grupos-de-usuarios']);
        },
        error: (error) => {
          this.poNotification.error('Erro ao criar grupo: ' + (error.error?.message || error.message));
          this.salvando = false;
        }
      });
  }
}