import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage {

  constructor(
    private authSvc: AuthService,
    public router: Router
  ) {
    this.router.navigate(['/mapa']);
  }
}
