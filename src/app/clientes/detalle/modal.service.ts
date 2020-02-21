import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: boolean = false;

  private _notificarUpload = new EventEmitter<any>(); // notificar cambios

  constructor() { }

  get notificarUpload(): EventEmitter<any> { // creando un metodo get para que sea publico el _notificarUpload
    return this._notificarUpload;
  }

  abrirModal() {
    this.modal = true;
  }

  cerrarModal() {
    this.modal = false;
  }
}
