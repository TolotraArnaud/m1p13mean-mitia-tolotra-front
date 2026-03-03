import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Booking } from "../models/models";

@Injectable({ providedIn: "root" })
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  createBooking(payload: { shopId:string; items:{product:string;quantity:number}[]; type:string }): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/my-bookings`);
  }

  validatePickup(pickupCode: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate`, { pickupCode });
  }

  // Route boutique - liste des reservations de la boutique
  getShopBookings(shopId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/shop/${shopId}`);
  }
}