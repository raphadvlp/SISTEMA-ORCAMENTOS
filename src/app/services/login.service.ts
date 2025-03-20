import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { loginCred } from '@app/class/loginCred';
import { loginData } from '@app/class/loginData';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private http = inject(HttpClient);
  private url: string = environment.urlSignin;
  private router = inject(Router);

  public sendLogin(login: string, password: string): Observable<loginData> {
    const headers: any = {
      'Content-Type': 'application/json',
    };

    let body: loginCred = {
      username: login,
      password: password,
    };

    return this.http.post<loginData>(`${this.url}/api/v1/signin`, body, { 
      headers: headers 
    });
  }
}
