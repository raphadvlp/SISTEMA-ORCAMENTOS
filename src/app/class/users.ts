export class Users {
  id_usuario: string = '';
  name: string = '';
  email: string = '';
  cpf: string = '';
  department: string = '';
  blocked: boolean = false;
  password: string = '';
  confirm_password: string = '';
  username: string = '';
  mustChangePassword: boolean = false;

  constructor() {
    this.id_usuario = '';
    this.name = '';
    this.email = '';
    this.cpf = '';
    this.password = '';
    this.confirm_password = '';
    this.department = '';
    this.blocked = false;
    this.username = '';
    this.mustChangePassword = false;
  }
}
