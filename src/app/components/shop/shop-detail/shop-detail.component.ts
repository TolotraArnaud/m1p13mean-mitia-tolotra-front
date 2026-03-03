import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ShopService } from '../../../services/shop.service';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { StatsService } from '../../../services/stats.service';
import { Product, Shop } from '../../../models/models';
import { ProductCardComponent } from '../../product/product-card/product-card.component';

@Component({
  selector: 'app-shop-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './shop-detail.component.html'
})
export class ShopDetailComponent implements OnInit {
  products: Product[] = [];
  shop: Shop | null = null;
  shopId = '';
  stats: any = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private shopService: ShopService,
    private productService: ProductService,
    private authService: AuthService,
    private statsService: StatsService
  ) {}

  ngOnInit(): void {
    this.shopId = this.route.snapshot.paramMap.get('id') || '';

    // Infos boutique (public)
    this.shopService.getAllShops().subscribe(shops => {
      this.shop = shops.find(s => s._id === this.shopId) || null;
    });

    if (this.authService.isLoggedIn()) {
      // Connecté → route protégée directe
      this.shopService.getShopProducts(this.shopId).subscribe({
        next: data => { this.products = data; this.loading = false; },
        error: () => this.loadPublic()
      });
      this.statsService.getInventoryStats(this.shopId).subscribe(s => this.stats = s);
    } else {
      // Non connecté → fallback public via /products/search
      this.loadPublic();
    }
  }

  private loadPublic(): void {
    this.productService.searchProducts({ sortBy: 'newest' }).subscribe({
      next: res => {
        this.products = res.data.filter(p => {
          const s = p.shop as any;
          return s?._id === this.shopId || s === this.shopId;
        });
        this.loading = false;
        if (this.products.length === 0) {
          this.error = 'Aucun produit trouvé pour cette boutique.';
        }
      },
      error: () => { this.loading = false; this.error = 'Impossible de charger les produits.'; }
    });
  }
}
