import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})

export class RegistrationPage implements OnInit {

  constructor(
    private authSvc: AuthService,
    public router: Router
  ) { }

  ngOnInit(){}

  async onRegister( email, password) {
    try {
      const user = await this.authSvc.register( email. value, password.value);
        if (user){
          const isVerified = this.authSvc.isEmailVerified(user);
          this.redirectUser(isVerified);
        }
    } catch (error) {
      console.log('Error->', error);
    }
  }

  private redirectUser(isVerified: boolean) {
    if (isVerified) {
       this.router.navigate(['dashboard']);
      } else {
       this.router.navigate(['verify-email']);
    }
  }

}
