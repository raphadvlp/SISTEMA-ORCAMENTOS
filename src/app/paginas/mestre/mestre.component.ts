import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  PoDialogService,
  PoMenuItem,
  PoMenuModule,
  PoMenuPanelItem,
  PoToolbarAction,
  PoToolbarModule,
  PoToolbarProfile,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-mestre',
  imports: [PoMenuModule, PoToolbarModule, RouterModule],
  templateUrl: './mestre.component.html',
  styleUrl: './mestre.component.css',
})
export class MestreComponent {
  public title: string = 'Home';
  #dialog = inject(PoDialogService);

  readonly menus: Array<PoMenuItem> = [
    {
      label: 'Home',
      shortLabel: 'home',
      link: '/home',
      action: this.clickItemMenu.bind(this),
      icon: 'po-icon an an-house-line',
    },
    {
      label: 'Financeiro',
      shortLabel: 'financeiro',
      link: '/financeiro',
      action: this.clickItemMenu.bind(this),
      icon: 'po-icon an an-calculator',
      subItems: [
        {
          label: 'Contas Orçamentárias',
          shortLabel: 'contas-orcamentarias',
          link: '/contas-orcamentarias',
          action: this.clickItemMenu.bind(this),
        },
        {
          label: 'Orcamentos',
          shortLabel: 'contas-orcamentarias',
          link: '/orcamentos',
          action: this.clickItemMenu.bind(this),
        },
        {
          label: 'Centro de Custo',
          shortLabel: 'centrodecusto',
          link: '/centrodecusto',
          action: this.clickItemMenu.bind(this),
        },
      ],
    },
    {
      label: 'Segurança',
      shortLabel: 'Segurança',
      link: '/seguranca',
      icon: 'po-icon an an-shield-check',
      subItems: [
        {
          label: 'Usuários',
          shortLabel: 'usuarios',
          link: '/usuarios',
          action: this.clickItemMenu.bind(this),
        },
      ],
    },
  ];

  clickItemMenu(menu: PoMenuPanelItem): void {
    //Deixa o título da página dinamica devido ao action: this.clickItemMenu.bind(this) e alimenta na variavel publica title que está começando como padrão 'Home'
    this.title = menu.label;
  }

  //Logoff
  clickItemLogoff() {
    this.#dialog.confirm({
      title: 'Sair do Sistema',
      message: 'Deseja realmente sair?',
      confirm: () => {
        localStorage.clear();
        location.reload();
      },
      cancel: () => {},
    });
  }

  profile: PoToolbarProfile = {
    avatar: 'https://via.placeholder.com/48x48?text=AVATAR',
    title: localStorage.getItem(`username`) ?? 'Usuário',
    // subtitle: localStorage.getItem(``),
  };

  profileActions: Array<PoToolbarAction> = [
    {
      icon: 'an an-sign-out',
      label: 'Exit',
      type: 'danger',
      // separator: true,
      action: this.clickItemLogoff.bind(this),
    },
  ];
}
