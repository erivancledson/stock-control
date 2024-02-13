import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookieService.get("USER_INFO");
  private httpOptions ={
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
       Authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  };

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getAllCategories(): Observable<Array<GetCategoriesResponse>> {
    return this.http.get<Array<GetCategoriesResponse>>(
      `${this.API_URL}/categories`,
       this.httpOptions
    )
  }

  createNewCategory(requestDatas: {
    name: string;
  }): Observable<Array<GetCategoriesResponse>> {
    return this.http.post<Array<GetCategoriesResponse>>(
      `${this.API_URL}/category`,
      requestDatas,
      this.httpOptions
    );
  }

  deleteCategory(requestDatas: { category_id: string }): Observable<void> {
    //spread operation: ...this.httpOptions faço a copia do header e adiono outros dados
    return this.http.delete<void>(`${this.API_URL}/category/delete`, {
      ...this.httpOptions,
      params: {
        category_id: requestDatas?.category_id,
      },
    });
  }

  editCategoryName(requestDatas: {
    name: string;
    category_id: string;
  }): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/category/edit`,
      { name: requestDatas?.name },
      {
        ...this.httpOptions,
        params: {
          category_id: requestDatas?.category_id,
        },
      }
    );
  }

}
