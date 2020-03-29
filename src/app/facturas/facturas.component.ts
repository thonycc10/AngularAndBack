import { Component, OnInit } from '@angular/core';
import {Factura} from './models/factura';
import {ClienteService} from '../clientes/cliente.service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {flatMap, map, startWith} from 'rxjs/operators';
import {FacturaService} from './services/factura.service';
import {Producto} from './models/producto';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material';
import {ItemFactura} from './models/item-factura';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {

  titulo: string = 'Nueva Factura';
  factura: Factura = new Factura();
  autocompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private facturaService: FacturaService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe( // se usa para los observables
        map(value => typeof value === 'string' ? value : value.nombre),
        flatMap(value => value ? this._filter(value) : [])
      );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();
    return this.facturaService.filterProducts(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  seleccionProducto(event: MatAutocompleteSelectedEvent): void {
    const producto = event.option.value as Producto; // se convierte en objeto generico en un producto
    console.log(producto);
    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    } else {
      const nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.itemFacturaList.push(nuevoItem);
    }
    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id: number, event: any): void {
    const cantidad: number = event.target.value as number;
    // map se usa para modificar
    this.factura.itemFacturaList = this.factura.itemFacturaList.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeItem(id: number): boolean {
    let existe = false;
    this.factura.itemFacturaList.forEach((item: ItemFactura) => {
      if (id === item.producto.id) {
        existe = true;
      }
    });
    return  existe;
  }

  incrementaCantidad(id: number): void {
    this.factura.itemFacturaList = this.factura.itemFacturaList.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        ++item.cantidad;
      }
      return  item;
    });
  }

}
