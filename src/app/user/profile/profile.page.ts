import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  uid: string;
  userRef: AngularFireObject<any>;
  usuario: any ={};


  constructor(
    private authSvc: AuthService,
    private db: AngularFireDatabase,
    public router: Router,
  ) {}

  ngOnInit() {
    this.authSvc.getUserAuth().subscribe(user => {
      this.uid = user.uid;
      this.getProfile().valueChanges().subscribe(val => {
        this.usuario =  val;
        console.log(this.usuario);
      });
    });
  }

  getProfile() {
    this.userRef = this.db.object('/Usuarios/' + this.uid);
    return this.userRef;
  }

  async onLogout(){
    try {
      await this.authSvc.logout();
       this.router.navigate(['/login']);
    } catch (error) {
      console.log('Error→', error);
    }
  }

  onEdit() {
    this.router.navigate(['profile/update/' + this.uid]);
  }
}
