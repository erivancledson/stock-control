import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { environment } from 'src/environments/environment';
import { ProductEvent } from '../../models/enums/products/ProductEvent';
import { DeleteProductResponse } from 'src/app/models/interfaces/products/response/DeleteProductResponse';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { CreateProductResponse } from 'src/app/models/interfaces/products/response/CreateProductResponse';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';
import { SaleProductRequest } from 'src/app/models/interfaces/products/request/SaleProductRequest';
import { SaleProductResponse } from 'src/app/models/interfaces/products/response/SaleProductResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

 private API_URL = environment.API_URL;
 private JWT_TOKEN = this.cookie.get('USER_INFO'); //recupera o valor do cookie
 private httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.JWT_TOKEN}`,
  }),
 };


  constructor(
    private http: HttpClient,
    private cookie: CookieService
  ) { }

  getAllProducts(): Observable<Array<GetAllProductsResponse>>{
    //<Array<GetAllProductsResponse>> o tipo de retorno
    return this.http.get<Array<GetAllProductsResponse>>(
      `${this.API_URL}/products`,
      this.httpOptions
    )
    //pipe = podemos manipular os dados com os seus operadores, rxjs
    //retorna os produtos que tem a quantidade maior que zero
    .pipe(map((product) => product.filter((data) => data?.amount > 0)));
  }

  deleteProduct(product_id: string): Observable<DeleteProductResponse>{
    return this.http.delete<DeleteProductResponse>(
      `${this.API_URL}/product/delete`,
      {
        ...this.httpOptions, params:{
          product_id: product_id
        }
      }
    )
  }

  createProduct(
    requestDatas: CreateProductRequest
  ): Observable<CreateProductResponse> {
    return this.http.post<CreateProductResponse>(
      `${this.API_URL}/product`,
      requestDatas,
      this.httpOptions
    );
  }

  editProduct(requestDatas: EditProductRequest): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/product/edit`,
      requestDatas,
      this.httpOptions
    );
  }

  saleProduct(
    requestDatas: SaleProductRequest
  ): Observable<SaleProductResponse> {
    return this.http.put<SaleProductResponse>(
      `${this.API_URL}/product/sale`,
      {
        amount: requestDatas?.amount, //request
      },
      {
        ...this.httpOptions,
        params: {
          product_id: requestDatas?.product_id, //parametros
        },
      }
    );
  }
}
