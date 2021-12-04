import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor( public alertC: AlertController, public toastC: ToastController ) { }

  async errorSesionAlert() {
    const alert = await this.alertC.create({
      header: 'Acceso Denegado!!!',
      backdropDismiss: false,
      message: 'Registrese o inicie sesión',
      buttons: ['OK']
    });
    await alert.present();
  }

  async errorSubirNoticiaAlert() {
    const alert = await this.alertC.create({
      header: 'Error',
      subHeader: 'Crear Noticia',
      backdropDismiss: false,
      message: 'Agregue una imagen por favor',
      buttons: ['OK']
    });

    await alert.present();
  }

  async resetPassAlert() {
    const alert = await this.alertC.create({
      backdropDismiss: false,
      message: 'Se envio correo para restablecer la contraseña',
      buttons: ['OK']
    });

    await alert.present();
  }

  async updateNotiAlert() {
    const alert = await this.alertC.create({
      header: 'Felicidades!!!',
      backdropDismiss: false,
      message: 'Se actualizo los datos de su Noticia correctamente',
      buttons: ['OK']
    });

    await alert.present();
  }
  async updateUserAlert() {
    const alert = await this.alertC.create({
      header: 'Felicidades!!!',
      backdropDismiss: false,
      message: 'Se actualizo los datos de su perfil',
      buttons: ['OK']
    });

    await alert.present();
  }

  async notFound(error) {
    const toast = await this.toastC.create({
      message: error,
      duration: 1000,
      color: 'danger'
    });
    toast.present();
  }

  async noExisteCorreo() {
    const toast = await this.toastC.create({
      message: 'Correo no registrado',
      duration: 1000,
      color: 'danger'
    });
    toast.present();
  }

  async existeCorreo() {
    const toast = await this.toastC.create({
      message: 'Correo ya registrado',
      duration: 1000,
      color: 'danger'
    });
    toast.present();
  }

  async errorLogin() {
    const toast = await this.toastC.create({
      message: 'Correo o contraseña incorrectos',
      duration: 1000,
      color: 'danger'
    });
    toast.present();
  }
}
