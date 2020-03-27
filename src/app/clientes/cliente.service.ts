import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {DatePipe, formatDate} from '@angular/common';
import {Region} from './region';
import {AuthService} from '../usuarios/auth.service';

@Injectable()
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  getRegiones(): Observable<Region[]>{
   return  this.http.get<Region[]>(this.urlEndPoint + '/regiones');
  }

  getClientes(page: number): Observable <any> {
    // return of(CLIENTES)}
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      map( (response: any) => {
      // const clientes = response as Cliente[]; // esto sirve para recorrer y cambiar el formato del texto observable
       (response.content as Cliente[]).map(cliente => {
         cliente.name = cliente.name.toUpperCase();
         const datePipe = new DatePipe('es');
         // cliente.createAt = datePipe.transform(cliente.createAt, 'fullDate'); // option 1 convertir formatDate
        // cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy'); // option 1 convertir formatDate
        // cliente.createAt = datePipe.transform(cliente.createAt, 'dd/MM/yyyy'); // option 2 convertir formatDate
        // cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US'); // option 3 convertir formatDate
         return cliente;
       });
       return response;
      })
      );
  }

  create(cliente: Cliente): Observable <Cliente> {
      return this.http.post(this.urlEndPoint, cliente).pipe(
        map( (response: any) => response.cliente as Cliente), // aqui estoy convirtiendo el obj Cliente
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }
          if (e.error.mensaje) {
            console.log(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
            this.router.navigate(['/clientes']);
            console.log(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.log(e.error.mensaje);
        }
        console.error(e.error.mensaje);
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.log(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });
    return this.http.request(req);
  }
}
