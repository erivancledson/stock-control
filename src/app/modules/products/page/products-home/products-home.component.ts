import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from '../../../../services/products/products.service';
import { Router } from '@angular/router';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html'
})
export class ProductsHomeComponent implements OnInit, OnDestroy{

  //quando se tem o dolar $, informa que ele é um observable
   private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;

   public productsDatas: Array<GetAllProductsResponse> = [];

   constructor(
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
   ){}

   ngOnInit(): void {
     this.getServiceProductsDatas();
   }

  getServiceProductsDatas() {
    //pega o array de produtos
    const productsLoaded = this.productsDtService.getProductsDatas();
    //verifica se é maior que zero
    if(productsLoaded.length > 0){
      console.log('DADOS DE PRODUTOS', this.productsDatas);
        this.productsDatas = productsLoaded; //pega o que tem memoria
    }else this.getAPIProductsDatas(); //quando ele não encontra em memoria vai buscar no back

  }

  getAPIProductsDatas() {
    this.productsService
    .getAllProducts()
    .pipe(takeUntil(this.destroy$)) //desiscreve
    .subscribe({
      next: (response) => {
        if(response.length > 0){
          this.productsDatas = response; //pega a resposta
          console.log(this.productsDatas)
        }
      },
      error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos',
            life: 2500
          })
          this.router.navigate(['/dashboard']); //deu erro ele vai para outra tela
      }
    })
  }

  handleProductAction(event: EventAction): void{
    if(event){
      //vai abrir o ProductFormComponent, feito uma modal
      this.ref = this.dialogService.open(ProductFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 1000,
        maximizable: true,
        data:{
          event: event,
          productDatas: this.productsDatas
        }
      });

      //para fechar a modal e desiscrever dela
      this.ref.onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.getAPIProductsDatas() //apos fechar é atualizado com o dado novo
        });

    }
  }

  handleDeleteProductAction(event: {
    product_id: string;
    productName: string;
  }): void{
     if(event){
      this.confirmationService.confirm({
        //tem que ter no module o ConfirmDialogModule e o ConfirmationService
        message: `Confirma a exclusão do produto: ${event?.productName}?`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteProduct(event?.product_id), //vai chamar a execução do produto
      })
     }
  }

  deleteProduct(product_id: string){
    if(product_id){
      this.productsService
        .deleteProduct(product_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if(response){
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto removido com sucesso!',
                life: 2500,
              });
              //atualiza a tabela depois que o dado foi deletado
              this.getAPIProductsDatas();
            }
          }, error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao remover produto!',
              life: 2500
            })
          }
        })
    }
  }

  ngOnDestroy(): void {
    //desiscreve
    this.destroy$.next();
    this.destroy$.complete();
  }

}
