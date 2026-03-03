import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatsService } from '../../../services/stats.service';
import { GlobalStats } from '../../../models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  stats: GlobalStats | null = null;
  loading = true;

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.statsService.getGlobalStats().subscribe({
      next: d => { this.stats = d; this.loading = false; },
      error: () => this.loading = false
    });
  }
}


