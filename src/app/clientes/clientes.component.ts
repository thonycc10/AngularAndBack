import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente.js';
import { ClienteService } from './cliente.service.js';
import swal from 'sweetalert2';
import {tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {ModalService} from './detalle/modal.service'; // reactivo tab
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  providers: [ClienteService],
})
export class ClientesComponent implements OnInit {

  paginador: any;
  clientes: Cliente[];
  clienteSelect: Cliente;
  constructor(
    private clienteService: ClienteService,
    private activetedRoute: ActivatedRoute,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.activetedRoute.paramMap.subscribe( params => { // captura el valor de la url  ver en app.module
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.clienteService.getClientes(page)
        .pipe(
          tap(response => {
            console.log('ClientesComponent: tap 3');
            (response.content as Cliente[]).forEach(cliente => {
              console.log(cliente.name);
            });
          })
        )
        .subscribe(response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        });
    });

    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {
        if (cliente.id == clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      });
    });
  }

  delete(cliente: Cliente): void {
    swal({
      title: 'Esta seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.name} ${cliente.apellido}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(response => {
          this.clientes = this.clientes.filter(cli => cli !== cliente);
          swal(
            'Cliente Eliminado',
            `Cliente ${cliente.name} ${cliente.apellido} eliminado con éxito.`,
            'success'
          );
        });
      }
    });
  }

  abrirModal(cliente: Cliente) {
    this.clienteSelect = cliente;
    this.modalService.abrirModal();
  }
}
