import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading = false;
  constructor(public loadingController: LoadingController) { }

  // Carga de imagen
  async cargaIMG() {
    this.isLoading = true;
    return await this.loadingController.create({
      // duration: 5000,
      message: 'Cargando imagen...',
      spinner: 'bubbles',
      translucent: true,
      backdropDismiss: false
    }).then(a => {
      a.present().then(() => {
        console.log('presented', this.isLoading);
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async cargaNoti() {
    this.isLoading = true;
    return await this.loadingController.create({
      // duration: 5000,
      message: 'Cargando espere...',
      spinner: 'bubbles',
      translucent: true,
      backdropDismiss: false
    }).then(a => {
      a.present().then(() => {
        console.log('presented', this.isLoading);
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async cargando() {
    this.isLoading = true;
    return await this.loadingController.create({
      // duration: 5000,
      spinner: 'bubbles',
      translucent: true,
      backdropDismiss: false
    }).then(a => {
      a.present().then(() => {
        console.log('presented', this.isLoading);
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async cargandoRuta() {
    this.isLoading = true;
    return await this.loadingController.create({
      duration: 500,
      spinner: 'bubbles',
      translucent: true,
      backdropDismiss: false
    }).then(a => {
      a.present().then(() => {
        console.log('presented', this.isLoading);
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed', this.isLoading));
  }
}
