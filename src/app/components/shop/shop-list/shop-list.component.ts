import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../../../services/shop.service';
import { Shop } from '../../../models/models';
import { ShopCardComponent } from '../shop-card/shop-card.component';

@Component({
  selector: 'app-shop-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ShopCardComponent],
  templateUrl: './shop-list.component.html'
})
export class ShopListComponent implements OnInit {
  shops: Shop[] = [];
  filteredShops: Shop[] = [];
  searchTerm = '';
  loading = true;

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.shopService.getAllShops().subscribe({
      next: data => {
        // N'afficher que les boutiques actives publiquement
        this.shops = data.filter(s => s.isActive === true || s.isActivated === true);
        this.filteredShops = this.shops;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  filterShops(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredShops = this.shops.filter(s =>
      s.nom.toLowerCase().includes(term) ||
      (s.description || '').toLowerCase().includes(term)
    );
  }
}
