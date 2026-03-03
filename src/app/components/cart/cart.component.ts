import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CartService } from "../../services/cart.service";
import { BookingService } from "../../services/booking.service";
import { AuthService } from "../../services/auth.service";
import { CartItem } from "../../models/models";

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: "./cart.component.html"
})
export class CartComponent implements OnInit {
  bookingType: "collect" | "try" = "collect";
  loading = false;
  successMessages: string[] = [];
  errorMsg = "";
  done = false;

  constructor(
    public cartService: CartService,
    private bookingService: BookingService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  get groups() { return this.cartService.itemsByShop; }

  updateQty(item: CartItem, delta: number): void {
    this.cartService.setQuantity(item.product._id!, item.quantity + delta);
  }

  remove(productId: string): void {
    this.cartService.removeItem(productId);
  }

  confirmReservations(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(["/login"]);
      return;
    }
    this.loading = true;
    this.errorMsg = "";
    this.successMessages = [];

    const groups = this.cartService.itemsByShop;
    let completed = 0;
    const total = groups.length;

    for (const group of groups) {
      const payload = {
        shopId: group.shopId,
        type: this.bookingType,
        items: group.items.map(i => ({
          product: i.product._id!,
          quantity: i.quantity
        }))
      };

      this.bookingService.createBooking(payload).subscribe({
        next: (res) => {
          this.successMessages.push(
            `${group.shopName} : code <strong>${res.pickupCode}</strong>`
          );
          completed++;
          if (completed === total) {
            this.loading = false;
            this.done = true;
            this.cartService.clear();
          }
        },
        error: (err) => {
          this.errorMsg = err.error?.message || "Erreur lors de la réservation";
          this.loading = false;
        }
      });
    }
  }
}
