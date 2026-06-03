import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber',
})
export class FormatNumberPipe implements PipeTransform {
  transform(value: number): string {
    // Arrondit à l'entier inférieur avant formatage.
    return Math.floor(value).toLocaleString('fr-FR');
  }
}
