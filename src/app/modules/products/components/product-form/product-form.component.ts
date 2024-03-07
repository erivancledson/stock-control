import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { ProductsService } from 'src/app/services/products/products.service';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { SaleProductRequest } from 'src/app/models/interfaces/products/request/SaleProductRequest';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject(); //subscreve

  public categoriesDatas: Array<GetCategoriesResponse> = [];
  public selectedCategory: Array<{ name: string; code: string }> = [];
  public productAction!: {  //passados pelo component pai que é o products-home-component, colocando quando tiver o editar
    event: EventAction;
    productDatas: Array<GetAllProductsResponse>;
  };

  public saleProductForm = this.formBuilder.group({
    amount: [0, Validators.required],
    product_id: ['', Validators.required],
  });

  public saleProductSelected!: GetAllProductsResponse;
  public productSelectedDatas!: GetAllProductsResponse;
  public productsDatas: Array<GetAllProductsResponse> =[]; //array que vai receber os dados

  //formulario reativo para pegar os dados do formulario e validar
  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  });

  //editar produto
  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
    category_id: ['', Validators.required]
  });

  public renderDropdown = false; //para alterar a categoria

  //propriedades
  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;

  constructor(
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder, //formulario reativos
    private messageService: MessageService,
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService, //armazena os dados em memorias ver isso
    private router: Router,
    public ref: DynamicDialogConfig //componente para carregar o modal
  ) {}

  ngOnInit(): void {
    this.productAction = this.ref.data; //vem do component pai

    //se for uma ação de vendas chama o método  this.getProductDatas(); seria um if mas não precisa
    this.productAction?.event?.action === this.saleProductAction &&
      this.getProductDatas();

    this.getAllCategories(); //busca todos os produtos
    this.renderDropdown = true; // se for editar
  }

  getAllCategories(): void {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.categoriesDatas = response;
            //se for editar entra nesse if
            if ( this.productAction?.event?.action === this.editProductAction && this.productAction?.productDatas) {
              this.getProductSelectedDatas(this.productAction?.event?.id as string); //pega o id do produto
            }

          }
        },
      });
  }

  //adiconar produto
  handleSubmitAddProduct(): void {
    if (this.addProductForm?.value && this.addProductForm?.valid) {
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string, //casting afirmando que é ums string
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: Number(this.addProductForm.value.amount), //convert para number
      };

      this.productsService
        .createProduct(requestCreateProduct) //envia os dados
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto criado com sucesso!',
                life: 2500,
              });
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar produto!',
              life: 2500,
            });
          },
        });
    }

    this.addProductForm.reset(); //limpa o formulario
  }

  handleSubmitEditProduct(): void {
    //se possui valor, esta valido e possui id
    if (
      this.editProductForm.value &&
      this.editProductForm.valid &&
      this.productAction.event.id
    ) {
      const requestEditProduct: EditProductRequest = {
        name: this.editProductForm.value.name as string,
        price: this.editProductForm.value.price as string,
        description: this.editProductForm.value.description as string,
        product_id: this.productAction?.event?.id,
        amount: this.editProductForm.value.amount as number,
        category_id: this.editProductForm.value.category_id as string
      };

      this.productsService
        .editProduct(requestEditProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto editado com sucesso!',
              life: 2500,
            });
            this.editProductForm.reset();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar produto!',
              life: 2500,
            });
            this.editProductForm.reset();
          },
        });
    }
  }

  //para pegar os componentes selecionados na tela para o editar
  getProductSelectedDatas(productId: string): void {
    const allProducts = this.productAction?.productDatas;
    //verifica se tem os dados
    if (allProducts.length > 0) {
      //pega somente o id que recebemos por parametro
      const productFiltered = allProducts.filter(
        (element) => element?.id === productId
      );

      if (productFiltered) {
        //no produto que foi filtrado
        this.productSelectedDatas = productFiltered[0];
        //preenche os dados para o formulario
        this.editProductForm.setValue({
          name: this.productSelectedDatas?.name,
          price: this.productSelectedDatas?.price,
          amount: this.productSelectedDatas?.amount,
          description: this.productSelectedDatas?.description,
          category_id: this.productSelectedDatas?.category.name
        });
      }
    }
  }

  //busca na api para salvar os dados em memoria// não precisa
  getProductDatas(): void {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
            this.productsDatas &&
              this.productsDtService.setProductsDatas(this.productsDatas); //atualiza os dados em memoria de produtos
          }
        },
      });
  }

  //executa a venda do produto
  handleSubmitSaleProduct(): void {
    if (this.saleProductForm?.value && this.saleProductForm?.valid) {
      const requestDatas: SaleProductRequest = {
        amount: this.saleProductForm.value?.amount as number,
        product_id: this.saleProductForm.value?.product_id as string,
      };

      this.productsService
        .saleProduct(requestDatas)
        .pipe(takeUntil(this.destroy$)) //desiscreve do observable
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Venda efetuada com sucesso!',
                life: 3000,
              });
              this.saleProductForm.reset(); //limpa o form
              this.getProductDatas(); //atualiza a tela com os produtos
              this.router.navigate(['/dashboard']); //envia para a tela de dashboard
            }
          },
          error: (err) => {
            console.log(err);
            this.saleProductForm.reset();
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao vender produto!',
              life: 3000,
            });
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
