import {Component, Input, OnInit} from '@angular/core';
import {Cliente} from '../cliente';
import {ClienteService} from '../cliente.service';
import swal from 'sweetalert2';
import {HttpEventType} from '@angular/common/http';
import {ModalService} from './modal.service';
import {AuthService} from '../../usuarios/auth.service';
import {FacturaService} from '../../facturas/services/factura.service';
import {Factura} from '../../facturas/models/factura';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

   @Input() cliente: Cliente; // input sirve para inyectar de otra vista
   titulo: string = 'Detalle del cliente';
   private fotoSeleccionada: File;
   progreso: number = 0;
  constructor(
    private facturaService: FacturaService,
    private clienteService: ClienteService,
    private modalService: ModalService,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  selectFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    // usa el indexOf para buscar el caracteres igual de un string y te retorna la posicion si no lo encuentra es -1
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      swal('Error: seleccionar imagen', 'El archivo debe ser del tipo de imagen', 'error')
      this.fotoSeleccionada = null;
    }
    console.log(this.fotoSeleccionada);
  }

  subirFoto() {

    if (!this.fotoSeleccionada) {
      swal('Error: Upload', 'Debe seleccionar una foto', 'error')
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe(event => {
         // this.cliente = cliente;
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response){
          // capturo la repuesta
            const response: any = event.body;
            this.cliente = response.cliente as Cliente;
            this.modalService.notificarUpload.emit(this.cliente);
            swal('La foto se ha subido completamente', response.mensaje, 'success');
          }
        });
    }
}
  cerrarModal() {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  delete(factura: Factura): void {
    swal({
      title: 'Esta seguro?',
      text: `¿Seguro que desea eliminar la factura ${factura.descripcion}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.facturaService.delete(factura.id).subscribe(response => {
          this.cliente.facturaList = this.cliente.facturaList.filter(f => f !== factura);
          swal(
            'Factura Eliminado',
            `Factura ${factura.descripcion} eliminada con éxito.`,
            'success'
          );
        });
      }
    });
  }
}
