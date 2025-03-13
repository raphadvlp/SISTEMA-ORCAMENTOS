import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Users } from '../class/users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  #http = inject(HttpClient);
  #url = environment.url;

  public getUsers(): Observable<Array<Users>> {
    let url: string = `${this.#url}/api/mock/usuario`;
    return this.#http.get<Array<Users>>(url);
  }
}
