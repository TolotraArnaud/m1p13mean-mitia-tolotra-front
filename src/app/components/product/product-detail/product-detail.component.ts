import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { Product } from '../../../models/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  editMode = false;
  editForm: Partial<Product> = {};
  selectedFile: File | null = null;
  successMsg = '';
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productService.getOneProduct(id).subscribe({
      next: data => { this.product = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  enterEdit(): void {
    if (!this.product) return;
    this.editForm = { nom: this.product.nom, description: this.product.description, prix: this.product.prix, stock: this.product.stock, poid: this.product.poid, promo: this.product.promo };
    this.editMode = true;
  }

  onFileChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) this.selectedFile = input.files[0];
  }

  saveEdit(): void {
    if (!this.product?._id) return;
    const fd = new FormData();
    Object.entries(this.editForm).forEach(([k, v]) => { if (v !== undefined) fd.append(k, v.toString()); });
    if (this.selectedFile) fd.append('image', this.selectedFile);

    this.productService.updateProduct(this.product._id, fd).subscribe({
      next: res => {
        this.product = res.data;
        this.editMode = false;
        this.successMsg = 'Produit mis à jour !';
      },
      error: err => this.errorMsg = err.error?.message || 'Erreur MAJ'
    });
  }

  getShopName(): string {
    if (this.product?.shop && typeof this.product.shop === 'object') {
      return (this.product.shop as any).nom;
    }
    return '';
  }

  getDiscountedPrice(): number {
    if (!this.product) return 0;
    if (this.product.promo && this.product.promo > 0) {
      return this.product.prix * (1 - this.product.promo / 100);
    }
    return this.product.prix;
  }

  /** Vrai si l'utilisateur connecté est le propriétaire de la boutique du produit */
  canEditProduct(): boolean {
    const currentUser = this.authService.currentUser;
    if (!currentUser || !this.product) return false;
    if (currentUser.role === 'admin') return true;
    const shop = this.product.shop as any;
    const ownerId = shop?.owner?._id || shop?.owner || '';
    return ownerId === currentUser.id;
  }
}
