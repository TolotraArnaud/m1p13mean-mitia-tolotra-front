import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/models';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.component.html'
})
export class AdminCategoriesComponent implements OnInit {
  allCategories: Category[] = [];
  loading = true;
  successMsg = '';
  errorMsg = '';

  // Création
  newCat = { nom: '', type: 'shop' as 'shop' | 'product' };
  showForm = false;

  // Edition
  editingCat: Category | null = null;
  editForm = { nom: '', type: 'shop' as 'shop' | 'product' };

  // Filtres & pagination
  filterType: 'all' | 'shop' | 'product' = 'all';
  filterStatus: 'all' | 'validated' | 'pending' = 'all';
  search = '';
  page = 1;
  pageSize = 10;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    // getAllCategories retourne toutes les catégories (validées + en attente)
    // On combine getShopCategories avec getPendingCategories si pas de route /all
    this.categoryService.getAllCategoriesAdmin().subscribe({
      next: d => { this.allCategories = d; this.loading = false; },
      error: () => {
        // Fallback: combine les deux listes
        this.loadFallback();
      }
    });
  }

  private loadFallback(): void {
    const validated: Category[] = [];
    const pending: Category[] = [];
    let done = 0;
    const finish = () => {
      if (++done === 2) {
        // Merge sans doublons
        const ids = new Set(pending.map(c => c._id));
        this.allCategories = [...pending, ...validated.filter(c => !ids.has(c._id))];
        this.loading = false;
      }
    };
    this.categoryService.getShopCategories().subscribe({ next: d => { validated.push(...d); finish(); }, error: finish });
    this.categoryService.getPendingCategories().subscribe({ next: d => { pending.push(...d); finish(); }, error: finish });
  }

  get filtered(): Category[] {
    let list = this.allCategories;
    if (this.filterType !== 'all') list = list.filter(c => c.type === this.filterType);
    if (this.filterStatus === 'validated') list = list.filter(c => c.isValidated);
    if (this.filterStatus === 'pending')   list = list.filter(c => !c.isValidated);
    if (this.search.trim()) {
      const t = this.search.toLowerCase();
      list = list.filter(c => c.nom.toLowerCase().includes(t));
    }
    return list;
  }

  get paged(): Category[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }
  get totalPages(): number { return Math.ceil(this.filtered.length / this.pageSize); }
  get pages(): number[] { return Array.from({length: this.totalPages}, (_, i) => i + 1); }

  get validatedCount(): number { return this.allCategories.filter(c => c.isValidated).length; }
  get pendingCount(): number   { return this.allCategories.filter(c => !c.isValidated).length; }

  /* ── Actions ── */

  createCat(): void {
    this.categoryService.createCategory(this.newCat).subscribe({
      next: res => {
        this.flash('success', res.message || 'Catégorie créée !');
        this.newCat = { nom: '', type: 'shop' };
        this.showForm = false;
        this.categoryService.refreshShopCategories();
        this.load();
      },
      error: err => this.flash('error', err.error?.message || 'Erreur')
    });
  }

  decide(id: string, action: 'accept' | 'reject'): void {
    this.categoryService.decideCategory(id, action).subscribe({
      next: res => {
        this.flash('success', res.message);
        this.categoryService.refreshShopCategories();
        this.load();
      },
      error: err => this.flash('error', err.error?.message || 'Erreur')
    });
  }

  startEdit(cat: Category): void {
    this.editingCat = cat;
    this.editForm = { nom: cat.nom, type: cat.type as 'shop' | 'product' };
  }

  cancelEdit(): void { this.editingCat = null; }

  saveEdit(): void {
    this.categoryService.updateCategory(this.editingCat!._id!, this.editForm).subscribe({
      next: res => {
        this.flash('success', res.message || 'Catégorie modifiée !');
        this.editingCat = null;
        this.categoryService.refreshShopCategories();
        this.load();
      },
      error: (err) => {
        if (err.status === 404 || err.status === 0) {
          this.flash('error', 'Route PUT /categories/:id manquante côté backend.');
        } else {
          this.flash('error', err.error?.message || 'Erreur modification');
        }
        this.editingCat = null;
      }
    });
  }

  private flash(type: 'success' | 'error', msg: string): void {
    if (type === 'success') { this.successMsg = msg; setTimeout(() => this.successMsg = '', 3500); }
    else { this.errorMsg = msg; setTimeout(() => this.errorMsg = '', 5000); }
  }
}
