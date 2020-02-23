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
      // para gaurdar los datos usar metodo del service authservice
        this.authService.guardarUsuario(r.access_token);
        this.authService.guardarToken(r.access_token);
        const usuario = this.authService.usuario;
      this.router.navigate(['/clientes']);
      swal('Login', `Hola ${usuario.username}, has iniciado sesión con éxito`, 'success');
    }, error => {
        if (error.status == 400) {
          swal('Error login', 'Usuario o clave incorrecta!', 'error');
        }
    });
  }

}
