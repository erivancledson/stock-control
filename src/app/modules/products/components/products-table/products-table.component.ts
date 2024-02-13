import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { DeleteProductAction } from 'src/app/models/interfaces/products/event/DeleteProductAction';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html'
})
export class ProductsTableComponent {

  //herda os dados do pai
  @Input() products: Array<GetAllProductsResponse> = [];

  //envia os dados para o pai
  @Output() productEvent = new EventEmitter<EventAction>();
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>();

  //pega o dado selecionado da tabela
  public productSelected!: GetAllProductsResponse;

  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;


  //emite o evento. Ele pode ou não receber um id
  handleProductEvent(action: string, id?: string): void{
    //diferente de undifined e diferente de vazio
    if(action && action !==''){
      //se ele receber o id passa os dois, se não passa somente a action
      const productEventData = id && id !== '' ? {action, id} : {action};
      //EMITIR O VALOR DO EVENTO do output
      this.productEvent.emit(productEventData);

    }
  }

  handleDeleteProduct(product_id: string, productName: string): void { //recebe o id e nome do produto
    if (product_id !== '' && productName !== '') {
      this.deleteProductEvent.emit({ //contem o id do produto e o obj
        product_id,
        productName,
      });
    }
  }

}

