import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Isso garante que o serviço esteja disponível globalmente.
})
export class ConfigService {
  private endpoint: string = '';
  private keyField: string = '';

  setConfig(endpoint: string, keyField: string) {
    this.endpoint = endpoint;
    this.keyField = keyField;
  }

  getEndpoint(): string {
    return this.endpoint;
  }

  getKeyField(): string {
    return this.keyField;
  }
}
