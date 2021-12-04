import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/user';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage {
  user$: Observable<User> = this.authSvc.afAuth.user;

  constructor(
    private authSvc: AuthService,
    public router: Router
  ) { }

  async onSendEmail(): Promise<void> {
    try {
      await this.authSvc.sendVerifcationEmail();
      } catch (error) {
       console.log('Error→', error);
     }
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(): void {
    this.authSvc.logout();
  }
}
