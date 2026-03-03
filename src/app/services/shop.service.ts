import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Shop, Product } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ShopService {
  private apiUrl = `${environment.apiUrl}/shops`;
  private productApiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAllShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>(this.apiUrl);
  }

  getMyShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>(`${this.apiUrl}/my-shops`);
  }

  createShop(payload: { nom: string; description: string; categorieId: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, payload);
  }

  updateShop(shopId: string, payload: { nom?: string; description?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${shopId}`, payload);
  }

  activateShop(shopId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${shopId}/activate`, {});
  }

  addProduct(shopId: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${shopId}/add-product`, formData);
  }

  /** Route protégée — pour utilisateurs connectés */
  getShopProducts(shopId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/${shopId}/products`);
  }

  /** Route publique — utilise /products/search avec populate shop */
  getShopProductsPublic(shopId: string): Observable<{ count: number; data: Product[] }> {
    return this.http.get<{ count: number; data: Product[] }>(
      `${this.productApiUrl}/search?sortBy=newest`
    );
  }

  getTop5ProductsForEachShop(): Observable<Shop[]> {
    return this.http.get<Shop[]>(`${this.apiUrl}/top5`);
  }

  getShopTop5Products(shopId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${shopId}/top5`);
  }
}
