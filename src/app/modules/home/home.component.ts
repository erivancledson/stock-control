import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy{

  private destroy$ = new Subject<void>(); //para destruir a tela e evita memory leak

  loginCard = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  signupForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor(
    private formBuilder: FormBuilder, //formularios reativos
    private userService: UserService,
    private CookieService: CookieService,
    private messageService: MessageService,
    private router: Router
     ){}


  onSubmitLoginForm(): void{
      //verifica se está preenchido e se esta valido
    if(this.loginForm.value && this.loginForm.valid){
      this.userService.authUser(this.loginForm.value as AuthRequest) //AuthRequest = alias
      .pipe(takeUntil(this.destroy$)) //evita memory leak
      .subscribe({
        next: (response) =>{
          if(response){
              //guarda o token jwt em um cookie que é o cookieService no USER_INFO
              this.CookieService.set('USER_INFO', response?.token);
              this.loginForm.reset(); //limpa o formulario

             this.router.navigate(['/dashboard']); //redireciona para o dashboar quando for logado

              this.messageService.add({ //toast
                severity: 'success',
                summary: 'Sucesso',
                detail: `Bem vindo de volta ${response?.name}!`,
                life: 2000 //tempo que ele vai ficar sendo exibido
              });
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao fazer o login!',
            life: 2000 //tempo que ele vai ficar sendo exibido
          });
          console.log(err);
        },
      })
    }
  }

  onSubmitSignupForm(): void{
    //se tiver valido e com o valor
    if(this.signupForm.value && this.signupForm.valid){
        this.userService.signupUser(this.signupForm.value as SignupUserRequest) //as faz um cast
        .pipe(takeUntil(this.destroy$)) //evita memory leak
        .subscribe({ //esta inscrevendo na chamada
          next: (response)=>{
            if(response){ //os dados de retorno do callback
              this.signupForm.reset(); //limpa os campos do formulario
              this.loginCard = true; //redireciona para o formulario de login

              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Usuário criado com sucesso!',
                life: 2000 //tempo que ele vai ficar sendo exibido
              });
            }
          },
          error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao criar usuário!',
                life: 2000 //tempo que ele vai ficar sendo exibido
              });
              console.log(err);
              },
            });
        }
      }

      ngOnDestroy(): void {
        //quando o componente é desmontado na tela, ele faz a chamada. Evita memory leak
        this.destroy$.next();
        this.destroy$.complete();
      }
    }

