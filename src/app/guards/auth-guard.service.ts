import { Injectable } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  //só acessa se estiver logado
  constructor(private userService: UserService, private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree { //tem varias formas de retorno = canActivate
    if (!this.userService.isLoggedIn()) { //se retornar false cai na home
      this.router.navigate(['/home']);
      return false;
    }

    this.userService.isLoggedIn(); //está logado
    return true;
  }

  //app.routing-module faz o restante da implementação
}

