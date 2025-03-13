export class Orcamento {
  id_orcamento: string = '';
  codigo_orcamento: string = '';
  descricao_orcamento: string = '';
  dt_inicio: string = '';
  dt_fim: string = '';
  numero_versao: string = '1'; // Inicializa com 1
  bloqueado: string = '';
  periodo: string = '';

  constructor() {
    this.id_orcamento = '';
    this.codigo_orcamento = '';
    this.descricao_orcamento = '';
    this.dt_inicio = '';
    this.dt_fim = '';
    this.numero_versao = '1'; // Inicializa com 1
    this.bloqueado = '';
    this.periodo = '';
  }
}
