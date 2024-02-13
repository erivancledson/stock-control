import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import {CardModule} from "primeng/card"
import {InputTextModule} from "primeng/inputtext"
import {ButtonModule} from "primeng/button"
import {ToastModule} from "primeng/toast"
import { HomeComponent } from './modules/home/home.component';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, //animações do primeng
    ReactiveFormsModule, //formularios reativos do angular
    HttpClientModule, //cliente http usado no service para se comunicar com a api
    //PrimeNg
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule
  ],
  providers: [
    CookieService, //instalado o CookieService
    MessageService //para o toast
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
