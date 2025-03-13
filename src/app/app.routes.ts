import { Routes } from '@angular/router';
import { MestreComponent } from './paginas/mestre/mestre.component';
import { HomeComponent } from './paginas/home/home.component';
import { NotfoundComponent } from './paginas/notfound/notfound.component';
import { ContasOrcamentariasComponent } from './paginas/ModuloContasOrcamentarias/contas-orcamentarias/contas-orcamentarias.component';
import { UsuariosComponent } from './paginas/ModuloUsuarios/usuarios/usuarios.component';
import { NovousuarioComponent } from './paginas/ModuloUsuarios/novousuario/novousuario.component';
import { NovacontaorcamentariaComponent } from './paginas/ModuloContasOrcamentarias/novacontaorcamentaria/novacontaorcamentaria.component';
// import { EditarusuarioComponent } from './paginas/editarusuario/editarusuario.component';
import { OrcamentosComponent } from './paginas/ModuloOrcamento/orcamentos/orcamentos.component';
// import { EditarorcamentoComponent } from './paginas/editarorcamento/editarorcamento.component';
import { NovoorcamentoComponent } from './paginas/ModuloOrcamento/novoorcamento/novoorcamento.component';
import { ItemListComponent } from './paginas/ModuloItensDoOrcamento/item-list/item-list.component';
import { CentrodecustoComponent } from './paginas/ModuloCentroDeCusto/centrodecusto/centrodecusto.component';
import { NovocentrodecustoComponent } from './paginas/ModuloCentroDeCusto/novocentrodecusto/novocentrodecusto.component';

export const routes: Routes = [
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
      // { path: 'editarusuario/:id', component: EditarusuarioComponent },
      { path: 'orcamentos', component: OrcamentosComponent },
      { path: 'novoorcamento', component: NovoorcamentoComponent },
      // { path: 'editarorcamento', component: EditarorcamentoComponent },
      { path: 'item-list', component: ItemListComponent },
      { path: 'centrodecusto', component: CentrodecustoComponent },
      { path: 'novocentrodecusto', component: NovocentrodecustoComponent },
    ],
  },
  { path: '**', component: NotfoundComponent },
];
