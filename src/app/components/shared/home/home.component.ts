import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ShopService } from '../../../services/shop.service';
import { Product, Shop } from '../../../models/models';
import { ProductCardComponent } from '../../product/product-card/product-card.component';
import { ShopCardComponent } from '../../shop/shop-card/shop-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, ShopCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  latestProducts: Product[] = [];
  allShops: Shop[] = [];
  loading = true;

  constructor(private productService: ProductService, private shopService: ShopService) {}

  ngOnInit(): void {
    this.productService.getLatestProducts().subscribe(data => {
      this.latestProducts = data;
      this.loading = false;
    });
    this.shopService.getAllShops().subscribe(data => this.allShops = data.slice(0, 6));
  }
}
