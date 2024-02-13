import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTransferService {
  // BehaviorSubject = termos acesso no valor emitido antes
 public productsDataEmitter$ = new BehaviorSubject<Array<GetAllProductsResponse> | null>(null);

 public productsDatas: Array<GetAllProductsResponse> = [];

 setProductsDatas(products: Array<GetAllProductsResponse>): void{
   if(products){
    //passa o dado para quem está inscrito neste observable
    this.productsDataEmitter$.next(products);
    this.getProductsDatas();
   }
 }

 //inscreve no observable e retorna os dados
 getProductsDatas(){
  //estara inscrito no BehaviorSubject, definir os dados de produtos da propriedade criada productsDataEmitter
  this.productsDataEmitter$
   .pipe(
     take(1), //chamado apenas uma vez e ele desiscreve do observable. desiscreve e não da problema de memory leak
     map((data) => data?.filter((product) => product.amount > 0)) //pega os dados que a quantidade for maior que zero
   )
   .subscribe({
      //retorno dos dados
      next: (response) =>{
       if(response){
          this.productsDatas = response; // todos os produtos
       }
      }
   });

   return this.productsDatas;
 }
}


