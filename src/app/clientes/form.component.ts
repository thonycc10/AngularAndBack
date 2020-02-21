import { Component, OnInit } from '@angular/core';
import {Cliente} from './cliente';
import {ClienteService} from './cliente.service';
import {ActivatedRoute, Router} from '@angular/router';
import swal from 'sweetalert2';
import {Region} from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private cliente: Cliente = new Cliente();
  private titulo: string = 'Crear Cliente';
  private errores: string[];
  private regiones: Region[];

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activateRouter: ActivatedRoute) { }


  ngOnInit() {
    this.cargarCliente();
    this.cargarRegiones();
  }

  cargarCliente(): void {
    this.activateRouter.params.subscribe(param => {
      let id = param['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
      }
    });
  }

  cargarRegiones() {
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }

  create(): void {
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes']);
        swal('Nuevo cliente', `El cliente ${cliente.name} ha sido creado con éxito`, 'success');
      },
      error1 => {
        this.errores = error1.error.Errors as string[];
        console.error('Código del error desde el backend: ' + error1.status);
        console.error(error1.error.Errors);
      }
      );
  }
  update(): void {
    this.clienteService.update(this.cliente).subscribe(cliente => {
      this.router.navigate(['/clientes']);
      swal('Cliente Actualizado', `El cliente  ${cliente.name} ha sido actualizado con éxito`, 'success');
    },
      error1 => {
        this.errores = error1.error.Errors as string[];
        console.error('Código del error desde el backend: ' + error1.status);
        console.error(error1.error.Errorss);
      });
  }

  compararRegion(o1: Region, o2: Region): boolean{
    if (o1 === undefined && o2 === undefined ) {
        return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined  ? false : o1.id === o2.id;
  }

}
