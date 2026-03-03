import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../../../services/shop.service';
import { Shop } from '../../../models/models';

@Component({
  selector: 'app-admin-shops',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-shops.component.html'
})
export class AdminShopsComponent implements OnInit {
  allShops: Shop[] = [];
  loading = true;
  filter: 'all' | 'active' | 'pending' = 'all';
  search = '';
  successMsg = '';
  errorMsg = '';
  page = 1;
  pageSize = 10;

  // Editing
  editingShop: Shop | null = null;
  editForm = { nom: '', description: '' };

  constructor(private shopService: ShopService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.shopService.getAllShops().subscribe({
      next: d => { this.allShops = d; this.loading = false; },
      error: () => this.loading = false
    });
  }

  get filtered(): Shop[] {
    let list = this.allShops;
    if (this.filter === 'active')  list = list.filter(s => s.isActivated);
    if (this.filter === 'pending') list = list.filter(s => !s.isActivated);
    if (this.search.trim()) {
      const t = this.search.toLowerCase();
      list = list.filter(s => s.nom.toLowerCase().includes(t));
    }
    return list;
  }

  get paged(): Shop[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }
  get totalPages(): number { return Math.ceil(this.filtered.length / this.pageSize); }
  get pages(): number[] { return Array.from({length: this.totalPages}, (_, i) => i + 1); }

  get activeCount():  number { return this.allShops.filter(s => s.isActivated).length; }
  get pendingCount(): number { return this.allShops.filter(s => !s.isActivated).length; }

  catName(shop: Shop): string  { return (shop.categorie as any)?.nom  || '—'; }
  ownerName(shop: Shop): string { return (shop.owner as any)?.nom || '—'; }

  activate(shop: Shop): void {
    this.shopService.activateShop(shop._id!).subscribe({
      next: () => {
        this.flash('success', `Boutique "${shop.nom}" activée !`);
        this.load();
      },
      error: (err) => this.flash('error', err.error?.message || 'Erreur activation')
    });
  }

  startEdit(shop: Shop): void {
    this.editingShop = shop;
    this.editForm = { nom: shop.nom, description: shop.description || '' };
  }

  cancelEdit(): void { this.editingShop = null; }

  saveEdit(): void {
    if (!this.editingShop) return;
    this.shopService.updateShop(this.editingShop._id!, this.editForm).subscribe({
      next: () => {
        this.flash('success', 'Boutique modifiée !');
        this.editingShop = null;
        this.load();
      },
      error: (err) => this.flash('error', err.error?.message || 'Erreur modification')
    });
  }

  private flash(type: 'success' | 'error', msg: string): void {
    if (type === 'success') { this.successMsg = msg; setTimeout(() => this.successMsg = '', 3500); }
    else { this.errorMsg = msg; setTimeout(() => this.errorMsg = '', 4000); }
  }
}
