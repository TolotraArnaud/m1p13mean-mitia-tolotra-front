import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Product } from "../models/models";

@Injectable({ providedIn: "root" })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  searchProducts(filters: {
    keyword?: string; minPrice?: number; maxPrice?: number;
    popular?: boolean; type?: string; sortBy?: string;
  }): Observable<{ count: number; success: boolean; data: Product[] }> {
    let params = new HttpParams();
    if (filters.keyword) params = params.set("keyword", filters.keyword);
    if (filters.minPrice != null) params = params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice != null) params = params.set("maxPrice", filters.maxPrice.toString());
    if (filters.popular) params = params.set("popular", "true");
    if (filters.type) params = params.set("type", filters.type);
    if (filters.sortBy) params = params.set("sortBy", filters.sortBy);
    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  getLatestProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/latest`);
  }

  getOneProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  toggleAvailability(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/toggle-availability`, {});
  }

  updateStock(id: string, stock: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/stock`, { stock });
  }
}
