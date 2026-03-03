import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BookingService } from "../../services/booking.service";
import { ShopService } from "../../services/shop.service";
import { Booking, Shop } from "../../models/models";

@Component({
  selector: "app-shop-bookings",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./shop-bookings.component.html"
})
export class ShopBookingsComponent implements OnInit {
  myShops: Shop[] = [];
  selectedShopId = "";
  bookings: Booking[] = [];
  loading = false;
  loadingShops = true;
  pickupCode = "";
  validateLoading = false;
  successMsg = "";
  errorMsg = "";

  // Pagination
  page = 1;
  pageSize = 10;

  constructor(
    private bookingService: BookingService,
    private shopService: ShopService
  ) {}

  ngOnInit(): void {
    this.shopService.getMyShops().subscribe({
      next: shops => {
        this.myShops = shops;
        this.loadingShops = false;
        if (shops.length > 0) {
          this.selectedShopId = shops[0]._id!;
          this.loadBookings();
        }
      },
      error: () => this.loadingShops = false
    });
  }

  loadBookings(): void {
    if (!this.selectedShopId) return;
    this.loading = true;
    this.bookings = [];
    this.bookingService.getShopBookings(this.selectedShopId).subscribe({
      next: d => { this.bookings = d; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onShopChange(): void {
    this.page = 1;
    this.loadBookings();
  }

  get pending(): Booking[] {
    return this.bookings.filter(b => b.status === "pending" || b.status === "confirmed");
  }

  get completed(): Booking[] {
    return this.bookings.filter(b => b.status === "completed");
  }

  get paged(): Booking[] {
    const start = (this.page - 1) * this.pageSize;
    return this.pending.slice(start, start + this.pageSize);
  }
  get totalPages(): number { return Math.ceil(this.pending.length / this.pageSize); }
  get pages(): number[] { return Array.from({length: this.totalPages}, (_, i) => i+1); }

  validateCode(): void {
    if (!this.pickupCode.trim()) return;
    this.validateLoading = true;
    this.successMsg = "";
    this.errorMsg = "";
    this.bookingService.validatePickup(this.pickupCode.trim().toUpperCase()).subscribe({
      next: res => {
        this.successMsg = res.message || "Retrait validé !";
        this.pickupCode = "";
        this.validateLoading = false;
        this.loadBookings();
      },
      error: err => {
        this.errorMsg = err.error?.message || "Code invalide ou déjà utilisé";
        this.validateLoading = false;
      }
    });
  }

  getUserName(b: Booking): string {
    const u = b.user as any;
    return u ? `${u.prenom || ""} ${u.nom || ""}`.trim() : "Client";
  }

  getTotal(b: Booking): number {
    return b.totalAmount || b.items.reduce((s,i) => s + (i.prix||0)*i.quantity, 0);
  }
}
