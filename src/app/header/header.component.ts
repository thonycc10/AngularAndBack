import {Component} from '@angular/core';
import {AuthService} from '../usuarios/auth.service';
import swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
    title: string = 'Angular y Spring 5';

    constructor(
      private authService: AuthService,
      private router: Router
    ) {
    }

  logout(): void{
      this.authService.logout();
      swal('Logout', `Hola ${this.authService.usuario.username} has cerrado sessión con exito`, 'success' );
      this.router.navigate(['/login'])
  }
}
