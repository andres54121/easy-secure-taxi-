import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isAuth ;
  constructor(
    private authSvc: AuthService,
  ) {
    this.authSvc.getUserAuth().subscribe(user => {
      if (user == null) {
        this.isAuth = false;
      } else {
        this.isAuth = true;
      }
    });
  }
}
