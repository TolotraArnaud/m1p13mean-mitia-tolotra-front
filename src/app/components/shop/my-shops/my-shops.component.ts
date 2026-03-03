import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
// import { RouterLink } from "@angular/router";
import { ShopService } from "../../../services/shop.service";
import { CategoryService } from "../../../services/category.service";
import { StatsService } from "../../../services/stats.service";
import { ProductService } from "../../../services/product.service";
import { Shop, Category, Product } from "../../../models/models";

@Component({
  selector: "app-my-shops",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./my-shops.component.html"
})
export class MyShopsComponent implements OnInit {
  myShops: Shop[] = [];
  categories: Category[] = [];
  selectedShop: Shop | null = null;
  shopProducts: Product[] = [];
  shopStats: any = null;
  loading = true;
  productLoading = false;
  successMsg = "";
  errorMsg = "";
  showCreateForm = false;

  // Creation boutique
  newShop = { nom: "", description: "", categorieId: "" };

  // Edition boutique
  editingShop: Shop | null = null;
  editShopForm = { nom: "", description: "" };

  // Ajout produit
  newProduct = { nom: "", description: "", prix: 0, poid: 0, stock: 0, isStockable: true };
  selectedFile: File | null = null;
  showAddProduct = false;

  // Edition produit
  editingProduct: Product | null = null;
  editProductForm: any = {};
  editProductFile: File | null = null;

  // Stock rapide
  stockEditId: string | null = null;
  stockEditValue = 0;

  // Pagination
  prodPage = 1;
  prodPageSize = 10;

  constructor(
    private shopService: ShopService,
    private categoryService: CategoryService,
    private statsService: StatsService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadMyShops();
    this.categoryService.getShopCategories().subscribe(cats => this.categories = cats);
  }

  loadMyShops(): void {
    this.loading = true;
    this.shopService.getMyShops().subscribe({
      next: data => { this.myShops = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  createShop(): void {
    this.shopService.createShop(this.newShop).subscribe({
      next: () => {
        this.flash("success", "Boutique créée avec succès !");
        this.newShop = { nom: "", description: "", categorieId: "" };
        this.showCreateForm = false;
        this.loadMyShops();
      },
      error: err => this.flash("error", err.error?.message || "Erreur lors de la création")
    });
  }

  startEditShop(shop: Shop, e: Event): void {
    e.stopPropagation();
    this.editingShop = shop;
    this.editShopForm = { nom: shop.nom, description: shop.description || "" };
    this.showCreateForm = false;
  }

  cancelEditShop(): void { this.editingShop = null; }

  saveEditShop(): void {
    if (!this.editingShop) return;
    this.shopService.updateShop(this.editingShop._id!, this.editShopForm).subscribe({
      next: () => {
        this.flash("success", "Boutique modifiée !");
        this.editingShop = null;
        this.loadMyShops();
      },
      error: err => this.flash("error", err.error?.message || "Erreur modification")
    });
  }

  selectShop(shop: Shop): void {
    if (this.editingShop?._id === shop._id) return;
    this.selectedShop = shop;
    this.prodPage = 1;
    this.productLoading = true;
    this.shopService.getShopProducts(shop._id!).subscribe({
      next: data => { this.shopProducts = data; this.productLoading = false; },
      error: () => { this.shopProducts = []; this.productLoading = false; }
    });
    this.statsService.getInventoryStats(shop._id!).subscribe(s => this.shopStats = s);
  }

  // --- Produits ---
  get pagedProducts(): Product[] {
    const s = (this.prodPage - 1) * this.prodPageSize;
    return this.shopProducts.slice(s, s + this.prodPageSize);
  }
  get prodTotalPages(): number { return Math.ceil(this.shopProducts.length / this.prodPageSize); }
  get prodPages(): number[] { return Array.from({length: this.prodTotalPages}, (_, i) => i+1); }

  onFileChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) this.selectedFile = input.files[0];
  }

  addProduct(): void {
    if (!this.selectedShop) return;
    const fd = new FormData();
    fd.append("nom", this.newProduct.nom);
    fd.append("description", this.newProduct.description);
    fd.append("prix", this.newProduct.prix.toString());
    fd.append("poid", this.newProduct.poid.toString());
    fd.append("isStockable", this.newProduct.isStockable.toString());
    fd.append("stock", this.newProduct.stock.toString());
    if (this.selectedFile) fd.append("image", this.selectedFile);
    this.shopService.addProduct(this.selectedShop._id!, fd).subscribe({
      next: () => {
        this.flash("success", "Produit ajouté !");
        this.showAddProduct = false;
        this.newProduct = { nom: "", description: "", prix: 0, poid: 0, stock: 0, isStockable: true };
        this.selectedFile = null;
        this.selectShop(this.selectedShop!);
      },
      error: err => this.flash("error", err.error?.message || "Erreur ajout produit")
    });
  }

  startEditProduct(p: Product): void {
    this.editingProduct = p;
    this.editProductForm = {
      nom: p.nom, description: p.description, prix: p.prix,
      stock: p.stock, poid: p.poid, promo: p.promo,
      isStockable: p.isStockable, manualAvailability: p.manualAvailability
    };
    this.editProductFile = null;
  }

  cancelEditProduct(): void { this.editingProduct = null; }

  onEditProductFile(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) this.editProductFile = input.files[0];
  }

  saveEditProduct(): void {
    if (!this.editingProduct?._id) return;
    const fd = new FormData();
    Object.entries(this.editProductForm).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v!.toString());
    });
    if (this.editProductFile) fd.append("image", this.editProductFile);
    this.productService.updateProduct(this.editingProduct._id, fd).subscribe({
      next: res => {
        this.flash("success", "Produit modifié !");
        this.editingProduct = null;
        const idx = this.shopProducts.findIndex(p => p._id === res.data._id);
        if (idx > -1) this.shopProducts[idx] = res.data;
      },
      error: err => this.flash("error", err.error?.message || "Erreur modification")
    });
  }

  toggleAvailability(p: Product): void {
    this.productService.toggleAvailability(p._id!).subscribe({
      next: res => {
        const idx = this.shopProducts.findIndex(x => x._id === p._id);
        if (idx > -1) this.shopProducts[idx] = { ...this.shopProducts[idx], manualAvailability: res.manualAvailability, isAvailable: res.isAvailable };
        this.flash("success", res.message || "Disponibilité mise à jour");
      },
      error: err => this.flash("error", err.error?.message || "Erreur toggle")
    });
  }

  startStockEdit(p: Product): void {
    this.stockEditId = p._id!;
    this.stockEditValue = p.stock || 0;
  }

  saveStock(p: Product): void {
    this.productService.updateStock(p._id!, this.stockEditValue).subscribe({
      next: res => {
        const idx = this.shopProducts.findIndex(x => x._id === p._id);
        if (idx > -1) this.shopProducts[idx] = { ...this.shopProducts[idx], stock: this.stockEditValue };
        this.stockEditId = null;
        this.flash("success", "Stock mis à jour !");
      },
      error: err => this.flash("error", err.error?.message || "Erreur stock")
    });
  }

  deleteProduct(p: Product): void {
    if (!confirm(`Supprimer "${p.nom}" ?`)) return;
    this.productService.deleteProduct(p._id!).subscribe({
      next: () => {
        this.flash("success", "Produit supprimé !");
        this.shopProducts = this.shopProducts.filter(x => x._id !== p._id);
      },
      error: err => this.flash("error", err.error?.message || "Erreur suppression")
    });
  }

  private flash(type: "success" | "error", msg: string): void {
    if (type === "success") { this.successMsg = msg; setTimeout(() => this.successMsg = "", 3500); }
    else { this.errorMsg = msg; setTimeout(() => this.errorMsg = "", 4000); }
  }

  getShopCategoryName(shop: Shop): string {
    return (shop.categorie as any)?.nom || "";
  }
}
