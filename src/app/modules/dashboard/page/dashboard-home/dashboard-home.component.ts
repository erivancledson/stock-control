import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { MessageService } from 'primeng/api';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { Subject, takeUntil } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy{

  private destroy$ = new Subject<void>(); //para destruir a tela e evita memory leak

  //blibliteca para exibir os graficos
  public productChartDatas!: ChartData;
  public productsChartOptions!: ChartOptions;

  //cria uma lista com o retorno do dados
public productsList: Array<GetAllProductsResponse> = [];

  constructor(
    private produtsService: ProductsService,
    private messageService: MessageService, // do toast
    private productDtService: ProductsDataTransferService

    ){}

    ngOnInit(): void{
      this.getProductsDatas();
    }

    getProductsDatas(): void{
      this.produtsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$)) //evita memory leak
      .subscribe({
        next: (response) => {
          if(response.length > 0){
            this.productsList = response; //response é o array que tem todos os dados
            this.productDtService.setProductsDatas(this.productsList);
            this.setProductsChartConfig(); //chama o metodo para criar o grafico
          }
          }, error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao buscar produtos!',
              life: 2500,
            });
          },
      });
    }

    setProductsChartConfig(): void{
      if(this.productsList.length > 0){ //se a lista de produtos for maior que zero
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--suface-border');

        //definir o array dos produtos
        this.productChartDatas = {
          labels: this.productsList.map((element) => element?.name), //pega o nome do produto
          datasets:[
            {
              label: 'Quantidade',
              backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
              borderColor: documentStyle.getPropertyValue('--indigo-400'),
              hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
              data: this.productsList.map((element) => element?.amount), //pega a quantidade de cada produto

            },
          ],
        };
        //montagem do grafico com os parametros passados
        this.productsChartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
              legend: {
                labels: {
                  color: textColor
                }
              }
            },

            scales:{
              x: {
                ticks: {
                  color: textColorSecondary,
                  font: {
                    weight: '500',
                  },
                },
                grid: {
                  color: surfaceBorder
                }
              },

              y:{
                ticks: {
                  color: textColorSecondary
                },
                grid: {
                  color: surfaceBorder
                }
              }
            },
        };
      }
    }


    ngOnDestroy(): void {
      //quando o componente é desmontado na tela, ele faz a chamada. Evita memory leak
      this.destroy$.next();
      this.destroy$.complete();
    }
}
