import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { loginData } from '@app/class/loginData';
import { LoginService } from '@app/services/login.service';
import { ConfigService } from '@app/services/transformConfig.service';
import { PoLanguage, PoLoadingModule, PoNotificationService } from '@po-ui/ng-components';
import { PoPageLoginComponent, PoPageLoginCustomField, PoPageLoginLiterals, PoPageLoginModule } from '@po-ui/ng-templates';

@Component({
  selector: 'app-login',
  imports: [PoPageLoginModule, PoLoadingModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public titleSystem: string = 'MPE - Gestão Orçamentária';
  public textLoading: string = 'Realizando login...';
  public logoLogin: string = 'logo.png';
  public backgroundLogin: string = 'bglogin.png';

  public isHiddenLoading: boolean = true;

  private loginService = inject(LoginService);
  private loginData!: loginData;
  private router = inject(Router);
  private notify = inject(PoNotificationService);

  constructor(
    private ConfigService: ConfigService,
  ) {
      ConfigService.setConfig('login', 'id');
    }

  public customLiterals: PoPageLoginLiterals = {
      loginPlaceholder: 'Insira seu usuário de acesso',
      passwordPlaceholder: 'Insira sua senha de acesso',
      submitLabel: 'Acessar sistema'
  };
    

  public confirmLogin(loginPage: PoPageLoginComponent) {
    this.isHiddenLoading = true;
    this.loginService.sendLogin(loginPage.login, loginPage.password).subscribe({
      next: (value) => {
        let loginNow = Date.now();
        this.loginData = value;

        localStorage.setItem('accessToken', this.loginData.accessToken);
        localStorage.setItem('expiresAt', (loginNow + this.loginData.expiresAt * 1000).toString());
        localStorage.setItem('username', loginPage.login);

        this.isHiddenLoading = true;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.log('error', err);

        let msgerro: string;

        err.erro.code === 401 ? (msgerro = err.error.message) : (msgerro = 'Login ou senha inválidos!');
        this.notify.error({duration: 2000, message: msgerro});
        this.isHiddenLoading = true;
      },
      complete: () => {},
    })
  }

}
