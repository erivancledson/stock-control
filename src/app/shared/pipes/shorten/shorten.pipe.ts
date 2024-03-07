import { Pipe, PipeTransform } from '@angular/core';

//criado com a geração de pipe, tem que está adiconado no export do shared.module.ts para usar em outros locais
@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {
  //esta informando que é 25 caracteres na tabela, se for maior que 25 colocar os ... ao fim
  transform(value: string, args: number): string {
    //se for maior que o numero de caracteres pretendido coloca ... se não informa o valor todo.
    if(value !== null){
      return value.length > args ? value.substring(0, args ) + '...': value;
    }
    //se for nulo retorna uma string vazia
    return '';
  }

}
