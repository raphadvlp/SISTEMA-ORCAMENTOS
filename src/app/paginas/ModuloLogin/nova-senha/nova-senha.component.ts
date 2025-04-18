import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PoNotificationService, PoPageModule } from '@po-ui/ng-components';
import { PoPageChangePasswordModule } from '@po-ui/ng-templates';

@Component({
  selector: 'app-nova-senha',
  imports: [PoPageModule, PoPageChangePasswordModule],
  templateUrl: './nova-senha.component.html',
  styleUrls: ['./nova-senha.component.css']
})
export class NovaSenhaComponent {
  constructor(private router: Router, private notify: PoNotificationService) {}

  public confirmChangePassword(event: any) {
    const { currentPassword, newPassword, confirmNewPassword } = event;

    if (newPassword !== confirmNewPassword) {
      this.notify.error('A nova senha e a confirmação não coincidem.');
      return;
    }

    // Simula uma chamada ao backend para alterar a senha
    console.log('Senha atual:', currentPassword);
    console.log('Nova senha:', newPassword);

    // Após a alteração bem-sucedida, redireciona para a página de login
    this.notify.success('Senha alterada com sucesso!');
    this.router.navigate(['/login']);
  }
}