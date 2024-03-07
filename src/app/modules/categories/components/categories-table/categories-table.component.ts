import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryEvent } from 'src/app/models/enums/category/CategoryEvent';
import { DeleteCategoryAction } from 'src/app/models/interfaces/categories/event/DeleteCategoryAction';
import { EditCategoryAction } from 'src/app/models/interfaces/categories/event/EditCategoryAction';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html'
})
export class CategoriesTableComponent {

  //recebe do pai os dados referente a categoria
  @Input() public categories: Array<GetCategoriesResponse> = [];

  @Output() public categoryEvent = new EventEmitter<EditCategoryAction>();

  @Output() public deleteCategoryEvent = new EventEmitter<DeleteCategoryAction>();

  public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

  public categorySelected!: GetCategoriesResponse; //retorna a categoria selecionada

  //recebe o id e o nome
  handleDeleteCategoryEvent(category_id: string, categoryName: string): void {
    if (category_id !== '' && categoryName !== '') {
      //emite o evento para o pai
      this.deleteCategoryEvent.emit({ category_id, categoryName });
    }
  }

  handleCategoryEvent(
    action: string,
    id?: string,
    categoryName?: string
  ): void {
    if (action && action !== '') {
      this.categoryEvent.emit({ action, id, categoryName });
    }
  }
}
