import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GlobalStats, InventoryStats } from '../models/models';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private apiUrl = `${environment.apiUrl}/stats`;

  constructor(private http: HttpClient) {}

  getGlobalStats(): Observable<GlobalStats> {
    return this.http.get<GlobalStats>(`${this.apiUrl}/global`);
  }

  getInventoryStats(shopId: string): Observable<InventoryStats> {
    return this.http.get<InventoryStats>(`${this.apiUrl}/inventory/${shopId}`);
  }

  getCategoryBreakdown(shopId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories/${shopId}`);
  }
}
