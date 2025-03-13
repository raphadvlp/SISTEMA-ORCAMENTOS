import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Contaorcamentaria } from '../class/contaorcamentaria';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContasorcamentariasService {
  #http = inject(HttpClient);
  #url = environment.url;

  public getContasOrcamentarias(): Observable<Array<Contaorcamentaria>> {
    let url: string = `${this.#url}/api/mock/contaorcamentaria`;
    return this.#http.get<Array<Contaorcamentaria>>(url);
  }
}
