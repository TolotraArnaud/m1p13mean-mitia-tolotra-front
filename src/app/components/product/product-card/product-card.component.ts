import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Product } from "../../../models/models";
import { CartService } from "../../../services/cart.service";

@Component({
  selector: "app-product-card",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./product-card.component.html"
})
export class ProductCardComponent {
  @Input() product!: Product;
  added = false;

  constructor(public cartService: CartService) {}

  getShopName(): string {
    if (this.product?.shop && typeof this.product.shop === "object") {
      return (this.product.shop as any).nom;
    }
    return "";
  }

  getDiscountedPrice(): number {
    if (this.product.promo && this.product.promo > 0) {
      return this.product.prix * (1 - this.product.promo / 100);
    }
    return this.product.prix;
  }

  addToCart(): void {
    if (!this.isAvailable) return;
    this.cartService.addItem(this.product);
    this.added = true;
    setTimeout(() => this.added = false, 1500);
  }

  get isAvailable(): boolean {
    return this.product.isAvailable !== false;
  }
}
