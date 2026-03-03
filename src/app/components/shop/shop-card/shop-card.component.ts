import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Shop } from '../../../models/models';

@Component({
  selector: 'app-shop-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shop-card.component.html'
})
export class ShopCardComponent {
  @Input() shop!: Shop;

  getCategoryName(): string {
    if (typeof this.shop.categorie === 'object' && this.shop.categorie !== null) {
      return (this.shop.categorie as any).nom;
    }
    return '';
  }

  getOwnerName(): string {
    if (typeof this.shop.owner === 'object' && this.shop.owner !== null) {
      return `${this.shop.owner.nom}`;
    }
    return '';
  }

  getInitials(): string {
    return this.shop.nom.substring(0, 2).toUpperCase();
  }
}
