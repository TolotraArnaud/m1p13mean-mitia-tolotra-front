import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Product, CartItem } from "../models/models";

@Injectable({ providedIn: "root" })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  get items(): CartItem[] { return this.itemsSubject.value; }
  get count(): number { return this.items.reduce((s,i) => s+i.quantity, 0); }
  get total(): number { return this.items.reduce((s,i) => s+i.product.prix*i.quantity, 0); }

  get itemsByShop(): {shopId:string;shopName:string;items:CartItem[]}[] {
    const map = new Map<string,{shopId:string;shopName:string;items:CartItem[]}>();
    for (const item of this.items) {
      const shop = item.product.shop as any;
      const shopId = shop?._id || shop;
      const shopName = shop?.nom || "Boutique";
      if (!map.has(shopId)) map.set(shopId, {shopId, shopName, items:[]});
      map.get(shopId)!.items.push(item);
    }
    return Array.from(map.values());
  }

  addItem(product: Product, qty = 1): void {
    const list = [...this.items];
    const idx = list.findIndex(i => i.product._id === product._id);
    if (idx > -1) list[idx] = {...list[idx], quantity: list[idx].quantity + qty};
    else list.push({product, quantity: qty});
    this.itemsSubject.next(list);
  }

  removeItem(productId: string): void {
    this.itemsSubject.next(this.items.filter(i => i.product._id !== productId));
  }

  setQuantity(productId: string, qty: number): void {
    if (qty <= 0) { this.removeItem(productId); return; }
    this.itemsSubject.next(this.items.map(i => i.product._id === productId ? {...i, quantity:qty} : i));
  }

  clear(): void { this.itemsSubject.next([]); }
}