import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'stock-control';

  constructor(private primeNgConfig: PrimeNGConfig) {} //adicionado o PrimeNGConfig

  ngOnInit(): void {
    this.primeNgConfig.ripple = true; //o que é ripple = referente as animações e os botões
    this.primeNgConfig.setTranslation({ //tradução dos filtros
      apply: 'Aplicar',
      clear: 'Limpar'
    })
  }
}
