import { Component, OnInit, HostListener, ElementRef } from "@angular/core";
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../services/auth.service";
import { CartService } from "../../../services/cart.service";
import { User } from "../../../models/user.model";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: "./navbar.component.html"
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  dropdownOpen = false;
  mobileMenuOpen = false;
  cartCount = 0;

  constructor(
    private authService: AuthService,
    public cartService: CartService,
    private router: Router,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
      this.dropdownOpen = false;
    });
    this.cartService.items$.subscribe(() => this.cartCount = this.cartService.count);
  }

  toggleDropdown(e: Event): void { e.stopPropagation(); this.dropdownOpen = !this.dropdownOpen; }
  toggleMobileMenu(): void { this.mobileMenuOpen = !this.mobileMenuOpen; }

  @HostListener("document:click", ["$event"])
  onDocumentClick(e: Event): void {
    if (!this.elRef.nativeElement.contains(e.target)) this.dropdownOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.dropdownOpen = false;
    this.mobileMenuOpen = false;
    this.router.navigate(["/login"]);
  }

  get isLoggedIn(): boolean { return this.authService.isLoggedIn(); }
  get isAdmin(): boolean    { return this.currentUser?.role === "admin"; }
  get isBoutique(): boolean { return this.currentUser?.role === "boutique"; }
}
