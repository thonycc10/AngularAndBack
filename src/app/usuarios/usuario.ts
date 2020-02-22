export class Usuario {
  id: number;
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  email: string;
  enable: boolean;
  roles: string[] = [];
}
