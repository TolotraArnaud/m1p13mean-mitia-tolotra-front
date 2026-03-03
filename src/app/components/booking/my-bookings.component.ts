import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { BookingService } from "../../services/booking.service";
import { Booking } from "../../models/models";

@Component({
  selector: "app-my-bookings",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./my-bookings.component.html"
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  error = "";

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getMyBookings().subscribe({
      next: d => { this.bookings = d; this.loading = false; },
      error: () => { this.error = "Erreur de chargement"; this.loading = false; }
    });
  }

  getShopName(b: Booking): string {
    return (b.shop as any)?.nom || "Boutique";
  }

  getTotal(b: Booking): number {
    return b.totalAmount || b.items.reduce((s, i) => s + (i.prix || 0) * i.quantity, 0);
  }

  statusLabel(s?: string): { text: string; cls: string } {
    const map: Record<string, { text: string; cls: string }> = {
      pending:   { text: "En attente",  cls: "dash-badge--amber" },
      confirmed: { text: "Confirmée",   cls: "dash-badge--blue"  },
      completed: { text: "Complétée",   cls: "dash-badge--green" },
      expired:   { text: "Expirée",     cls: "dash-badge--slate" },
      cancelled: { text: "Annulée",     cls: "dash-badge--red"   }
    };
    return map[s || "pending"] || map["pending"];
  }
}
