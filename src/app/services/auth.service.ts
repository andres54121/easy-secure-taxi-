import { Injectable } from '@angular/core';
import { User } from '../shared/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
// import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument }from '@angular/fire/compat/firestore';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { getDatabase, onValue, ref } from 'firebase/database';
import { AlertasService } from './alertas.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: Observable<User>;
  userRef: AngularFireList<any>;

  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private db: AngularFireDatabase,
    private alertasSvc: AlertasService,
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
         }
        return of (null);
      })
     );
  }

  async resetPassword(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log('Error->', error);
      this.alertasSvc.noExisteCorreo();
    }
  }

  async loginGoogle(): Promise<User> {
    try {
      const { user } = await this.afAuth.signInWithPopup(new GoogleAuthProvider());
      this.updateUserData(user);
      return user;
    } catch (error) {
      console.log('Error->', error);
    }
  }


  async register(email: string, password: string): Promise<User> {
    try {
      const { user } = await this.afAuth.createUserWithEmailAndPassword( email, password);
      await this.sendVerifcationEmail();
      return user;
    }catch (error) {
      console.log('Error->', error);
      this.alertasSvc.existeCorreo();
    }
  }

  async login( email: string, password: string): Promise<User> {
    try {
      const { user } = await this.afAuth.signInWithEmailAndPassword( email, password);
      this.updateUserData(user);
      return user;
    }catch (error) {
      console.log('Error->', error);
      this.alertasSvc.errorLogin();
     }
   }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    }catch (error) {
      console.log('Error->', error);
    }
  }

  async sendVerifcationEmail(): Promise<void> {
    try {
      return (await this.afAuth.currentUser).sendEmailVerification();
    } catch (error) {
      console.log('Error->', error);
    }
  }

  isEmailVerified(user: User): boolean {
    return user.emailVerified === true ? true : false;
  }

  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    this.userRef = this.db.list('/Usuarios');
    const db = getDatabase();
    let urlIMG = 'https://cdn.pixabay.com/photo/2014/06/27/16/47/person-378368_960_720.png';

    //Verifcar IMG
    onValue(ref(db, '/Usuarios/' + user.uid), (snapshot) => {
      urlIMG = (snapshot.val() && snapshot.val().photoURL);
    });

    if(!user.photoURL){
      urlIMG = 'https://cdn.pixabay.com/photo/2014/06/27/16/47/person-378368_960_720.png';
    } else if (urlIMG === 'https://cdn.pixabay.com/photo/2014/06/27/16/47/person-378368_960_720.png') {
      urlIMG = user.photoURL;
    }

    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      photoURL: urlIMG
    };

    this.userRef.update(user.uid, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      photoURL: urlIMG,
    });
   return userRef.set(data, { merge: true });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  getUserAuth(){
     return this.afAuth.authState;
  }

}
