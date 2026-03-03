import { Routes } from '@angular/router';
// import { Home } from './pages/home/home';
// import { Login } from './pages/login/login';
// import { Dashboard } from './pages/dashboard/dashboard';
// import { Logout } from './core/services/logout/logout';
import { authGuard, adminGuard, boutiqueGuard } from "./guards/auth.guard";


export const routes: Routes = [
  // { path: '', component: Home },
  // { path: 'login', component: Login },
  // { path: 'logout', component: Logout},
  // { path: 'dashboard', component: Dashboard, canActivate: [authGuard], data: { roles: ['admin'] } },

  // Public
  {
    path: "",
    loadComponent: () => import("./components/layouts/public-layout/public-layout.component").then(m => m.PublicLayoutComponent),
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "home",            loadComponent: () => import("./components/shared/home/home.component").then(m => m.HomeComponent) },
      { path: "login",           loadComponent: () => import("./components/auth/login/login.component").then(m => m.LoginComponent) },
      { path: "register",        loadComponent: () => import("./components/auth/register/register.component").then(m => m.RegisterComponent) },
      { path: "shops",           loadComponent: () => import("./components/shop/shop-list/shop-list.component").then(m => m.ShopListComponent) },
      { path: "shops/:id/products", loadComponent: () => import("./components/shop/shop-detail/shop-detail.component").then(m => m.ShopDetailComponent) },
      { path: "products/search", loadComponent: () => import("./components/product/product-search/product-search.component").then(m => m.ProductSearchComponent) },
      { path: "products/:id",    loadComponent: () => import("./components/product/product-detail/product-detail.component").then(m => m.ProductDetailComponent) },
      { path: "cart",            loadComponent: () => import("./components/cart/cart.component").then(m => m.CartComponent) },
      { path: "reservations",    canActivate: [authGuard], loadComponent: () => import("./components/booking/my-bookings.component").then(m => m.MyBookingsComponent) },
    ]
  },

  // ADMIN DASHBOARD
  {
    path: "admin",
    loadComponent: () => import("./components/layouts/dashboard-layout/dashboard-layout.component").then(m => m.DashboardLayoutComponent),
    canActivate: [adminGuard],
    children: [
      { path: "",           loadComponent: () => import("./components/admin/admin-dashboard/admin-dashboard.component").then(m => m.AdminDashboardComponent) },
      { path: "shops",      loadComponent: () => import("./components/admin/admin-shops/admin-shops.component").then(m => m.AdminShopsComponent) },
      { path: "categories", loadComponent: () => import("./components/admin/admin-categories/admin-categories.component").then(m => m.AdminCategoriesComponent) },
    ]
  },

  // BOUTIQUE DASHBOARD
  {
    path: "dashboard",
    loadComponent: () => import("./components/layouts/dashboard-layout/dashboard-layout.component").then(m => m.DashboardLayoutComponent),
    canActivate: [boutiqueGuard],
    children: [
      { path: "",          redirectTo: "my-shops", pathMatch: "full" },
      { path: "my-shops",  loadComponent: () => import("./components/shop/my-shops/my-shops.component").then(m => m.MyShopsComponent) },
      { path: "bookings",  loadComponent: () => import("./components/booking/shop-bookings.component").then(m => m.ShopBookingsComponent) },
    ]
  },


  // Redirection par défaut
  { path: '**', redirectTo: '' }
];
