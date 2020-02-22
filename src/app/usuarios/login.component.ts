import { Component, OnInit } from '@angular/core';
import {Usuario} from './usuario';
import swal from 'sweetalert2';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = 'Por favor Sign In!';
  usuario: Usuario;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
  }


  login(): void {
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null) {
      swal('Error Login', 'Username o password vacias!', 'error');
      return;
    }

    this.authService.login(this.usuario).subscribe(r => {
      console.log(r);
      console.log(JSON.parse(atob(r.access_token.split('.')[1])));
      const payload = JSON.parse(atob(r.access_token.split('.')[1]));
      this.router.navigate(['/clientes']);
      swal('Login', `Hola ${payload.user_name}, has iniciado sesión con éxito`, 'success');
    });
  }

}
