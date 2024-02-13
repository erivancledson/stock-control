import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './modules/home/home.component';
import { AuthGuard } from './guards/auth-guard.service';

const routes: Routes = [
  {
    path: '', //rota vazia ele vai pegar o dashboard
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'home', //login
    component: HomeComponent
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(
      (m) => m.DashboardModule //lazy load
      ),

      canActivate: [AuthGuard] //guarda de rotas
  },
  {
    path: 'products',
    loadChildren: () => import('./modules/products/products.module').then(
      (m) => m.ProductsModule //lazy load
    ),

    canActivate: [AuthGuard] //guarda de rotas
  },
  {
    path: 'categories',
    loadChildren: () => import("./modules/categories/categories.module").then(
      (m) => m.CategoriesModule
      ),

      canActivate: [AuthGuard] //guarda de rotas
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules //faz um cash nos modulos na aplicaçao. Faz um preload em todos os modulos da aplicação
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
