import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Orcamento } from '../class/orcamento';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  #http = inject(HttpClient);
  #url = environment.url;

  public getUsers(): Observable<Array<Orcamento>> {
    let url: string = `${this.#url}/api/mock/orcamento`;
    return this.#http.get<Array<Orcamento>>(url);
  }
}
