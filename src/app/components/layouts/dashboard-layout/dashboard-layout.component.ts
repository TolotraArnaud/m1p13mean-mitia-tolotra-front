import { Component, OnInit } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../services/auth.service";
import { FooterComponent } from "../../shared/footer/footer.component";
import { User } from "../../../models/user.model";

@Component({
  selector: "app-dashboard-layout",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FooterComponent],
  templateUrl: "./dashboard-layout.component.html"
})
export class DashboardLayoutComponent implements OnInit {
  currentUser: User | null = null;
  constructor(public authService: AuthService, private router: Router) {}
  ngOnInit(): void { this.authService.currentUser$.subscribe(u => this.currentUser = u); }
  logout(): void { this.authService.logout(); this.router.navigate(["/login"]); }
  get isAdmin(): boolean    { return this.currentUser?.role === "admin"; }
  get isBoutique(): boolean { return this.currentUser?.role === "boutique"; }
}
