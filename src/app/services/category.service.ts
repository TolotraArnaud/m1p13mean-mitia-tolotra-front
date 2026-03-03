import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  // Cache partagé : un seul appel HTTP pour toute l'application
  private shopCategories$: Observable<Category[]> | null = null;

  constructor(private http: HttpClient) {}

  /** Retourne les catégories de boutiques validées — appel unique mis en cache */
  getShopCategories(): Observable<Category[]> {
    if (!this.shopCategories$) {
      this.shopCategories$ = this.http
        .get<Category[]>(`${this.apiUrl}/shop-list`)
        .pipe(shareReplay(1));
    }
    return this.shopCategories$;
  }

  /** Force un rechargement du cache (après création/validation) */
  refreshShopCategories(): void {
    this.shopCategories$ = null;
  }

  createCategory(payload: { nom: string; type: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, payload);
  }

  getPendingCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/pending`);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/all`);
  }

  /** Récupère TOUTES les catégories (validées + en attente) pour l'admin */
  getAllCategoriesAdmin(): Observable<Category[]> {
    // On utilise /all si dispo, sinon le composant fait le fallback
    return this.http.get<Category[]>(`${this.apiUrl}/all`);
  }

  decideCategory(id: string, action: 'accept' | 'reject'): Observable<any> {
    return this.http.post(`${this.apiUrl}/decide/${id}`, { action });
  }

  /** PUT /categories/:id — route à ajouter côté backend si absente */
  updateCategory(id: string, payload: { nom: string; type: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }
}
