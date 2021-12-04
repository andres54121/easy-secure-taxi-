import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  constructor(
    private authSvc: AuthService,
    public router: Router
  ) {
    this.authSvc.getUserAuth().subscribe(user => {
      if (user !== null) {
        this.router.navigate(['mapa']);
      }
    });
  }

  ngOnInit() {}

  async onLogin( email, password) {
    try {
      const user = await this.authSvc.login( email. value, password.value);
        if (user){
          const isVerified = this.authSvc.isEmailVerified(user);
          this.redirectUser(isVerified);
        }
    } catch (error) {
      console.log('Error->', error);
    }
  }

  async onLoginGoogle(){
    try {
      const user = await this.authSvc.loginGoogle();
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
       this.router.navigate(['mapa']);
      } else {
       this.router.navigate(['verify-email']);
    }
  }
}
