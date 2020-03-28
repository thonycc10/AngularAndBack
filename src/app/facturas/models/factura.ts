import {ItemFactura} from './item-factura';
import {Cliente} from '../../clientes/cliente';

export class Factura {
  id: number;
  descripcion: string;
  observacion: string;
  itemFacturaList: Array<ItemFactura> = [];
  cliente: Cliente;
  total: number;
  createAt: string;
}
