import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product, Category } from '../../../models/models';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './product-search.component.html'
})
export class ProductSearchComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  count = 0;
  loading = false;

  filters = {
    keyword: '',
    categoryId: '',   // pour filtrer par catégorie (côté frontend après populate)
    sortBy: 'newest'
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    // Catégories : 1 seul appel grâce au cache partagé
    this.categoryService.getShopCategories().subscribe(cats => this.categories = cats);
    this.search();
  }

  search(): void {
    this.loading = true;
    this.productService.searchProducts({
      keyword: this.filters.keyword || undefined,
      sortBy: this.filters.sortBy
    }).subscribe({
      next: res => {
        let data = res.data;
        // Filtre catégorie en frontend (après populate shop.categorie)
        if (this.filters.categoryId) {
          data = data.filter(p => {
            const shop = p.shop as any;
            return shop?.categorie?._id === this.filters.categoryId
                || shop?.categorie === this.filters.categoryId;
          });
        }
        this.products = data;
        this.count = data.length;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  reset(): void {
    this.filters = { keyword: '', categoryId: '', sortBy: 'newest' };
    this.search();
  }
}

