import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(
    private authSvc: AuthService,
    public router: Router,
    private alertasSvc: AlertasService,
  ) { }

  ngOnInit() {
  }

  async onResetPass(email){
    try {
      await this.authSvc.resetPassword( email.value);
      this.alertasSvc.resetPassAlert();
      this.router.navigate(['/login']);
    } catch (error) {
      console.log('Error', error);
    }
  }
}
