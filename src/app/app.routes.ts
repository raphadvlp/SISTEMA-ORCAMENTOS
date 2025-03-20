import { Routes } from '@angular/router';
import { MestreComponent } from '@app/paginas/Mestre/mestre.component';
import { HomeComponent } from '@app/paginas/Home/home.component';
import { NotfoundComponent } from '@app/paginas/Notfound/notfound.component';
import { ContasOrcamentariasComponent } from '@app/paginas/ModuloContasOrcamentarias/contas-orcamentarias/contas-orcamentarias.component';
import { UsuariosComponent } from '@app/paginas/ModuloUsuarios/usuarios/usuarios.component';
import { NovousuarioComponent } from '@app/paginas/ModuloUsuarios/novousuario/novousuario.component';
import { NovacontaorcamentariaComponent } from '@app/paginas/ModuloContasOrcamentarias/novacontaorcamentaria/novacontaorcamentaria.component';
import { OrcamentosComponent } from '@app/paginas/ModuloOrcamento/orcamentos/orcamentos.component';
import { NovoorcamentoComponent } from '@app/paginas/ModuloOrcamento/novoorcamento/novoorcamento.component';
import { ItemListComponent } from '@app/paginas/ModuloItensDoOrcamento/item-list/item-list.component';
import { CentrodecustoComponent } from '@app/paginas/ModuloCentroDeCusto/centrodecusto/centrodecusto.component';
import { NovocentrodecustoComponent } from '@app/paginas/ModuloCentroDeCusto/novocentrodecusto/novocentrodecusto.component';
import { LoginComponent } from './paginas/ModuloLogin/login/login.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '',
    component: MestreComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'contas-orcamentarias', component: ContasOrcamentariasComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'novousuario', component: NovousuarioComponent },
      {
        path: 'novacontaorcamentaria',
        component: NovacontaorcamentariaComponent,
      },
      { path: 'orcamentos', component: OrcamentosComponent },
      { path: 'novoorcamento', component: NovoorcamentoComponent },
      { path: 'item-list', component: ItemListComponent },
      { path: 'centrodecusto', component: CentrodecustoComponent },
      { path: 'novocentrodecusto', component: NovocentrodecustoComponent },
    ],
    canActivate: [authGuard],
  },
  { path: '**', component: NotfoundComponent },
];
