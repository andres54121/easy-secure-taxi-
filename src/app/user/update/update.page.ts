import { Component, OnInit } from '@angular/core';
import { finalize, delay } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getDatabase, ref, update, set } from 'firebase/database';
import { AlertasService } from 'src/app/services/alertas.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  perfilForm: FormGroup;
  isSubmitted = false;
  userRef: AngularFireObject<any>;
  uid;img;
  dbR = getDatabase();
  // eslint-disable-next-line @typescript-eslint/naming-convention
  img_new;img2;url;
  file: any;
  idUSER;
  idIMG;

  image: any;
  urlImage: Observable<string>;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    private fb: FormBuilder,
    private alertasSvc: AlertasService,
    private loadingSvc: LoadingService,
    private storage: AngularFireStorage,
    private database: AngularFireDatabase,
  ) {
    this.perfilForm = this.fb.group({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Nombre: ['', [Validators.required, Validators.maxLength(20)]],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Tel: ['', [Validators.required, Validators.minLength(10), Validators.pattern('^[0-9]+$')]],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      IMG: [null]
    });
  }

  ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('uid');
    this.getInfo();
  }

  async getInfo(){
    try {
      await this.getProfile().valueChanges().subscribe(val => {
        console.log(val);
        this.perfilForm.controls.Nombre.setValue(val.name);
        this.perfilForm.controls.Tel.setValue(val.tel);
        this.img = val.photoURL;
        this.img2 = this.img;

      });
    } catch (error) {
      console.log('Error→', error);
    }
  }

  getProfile() {
    this.userRef = this.db.object('/Usuarios/' + this.uid);
    return this.userRef;
  }

  // Obtine la imagen que abrimos
  onUpload(e) {
    this.perfilForm.controls.IMG.setValue('');
    this.file = e.target.files[0];
    this.subirIMG();
    this.previewImg(e);
    console.log('subir', e.target.files[0]);
  }
  // Muestra la imagen elegida al usuario
  previewImg(e) {
    // eslint-disable-next-line prefer-const
    let reader = new FileReader();
    // eslint-disable-next-line @typescript-eslint/no-shadow
    reader.onload = (e: any) => {
      this.img_new = e.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
    this.img2 = '';
  }

  // Sube la imagen a firebase
  subirIMG() {
    const filePath = 'usuarios/perfil_' + this.uid + this.idIMG ;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload((filePath), this.file);
    if (this.idIMG) {
      this.loadingSvc.cargaIMG();
    } else {
      this.loadingSvc.cargaNoti();
    }
    task.snapshotChanges().pipe(
      finalize(() => {
        this.urlImage = ref.getDownloadURL();
        this.loadingSvc.dismiss();
      })).subscribe();
    console.log('url img', this.urlImage);
    this.perfilForm.controls.IMG.setValue(this.urlImage);
  }

  //verifica si existe una imagen
  verificar(url: any) {
    this.idIMG = this.uid;
    if (this.file) {
      this.subirIMG();
      this.img = url;
      this.updateUser();
    } else {
      this.updateUser();
    }
  }

  // Actualizar informacion de usuario
  updateUser() {
    const nombre = this.perfilForm.value.Nombre;
    const tel = this.perfilForm.value.Tel;

    update(ref(this.dbR, 'Usuarios/' + this.uid), {
      name: nombre,
      // eslint-disable-next-line object-shorthand
      tel: tel,
      photoURL: this.img
    })
    .then(() => {
      this.alertasSvc.updateUserAlert();
      this.router.navigate(['profile']);
      console.log('Guardado');
    })
    .catch((error) => {
      console.log(error);
    });
  }

  get errorControl() {
    return this.perfilForm.controls;
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.perfilForm.valid) {
      console.log('Please provide all the required values!');
      return false;
    } else {
      console.log(this.perfilForm.value);
    }
  }
}

export const snapshotToObject = snapshot => {
  // eslint-disable-next-line prefer-const
  let item = snapshot.val();
  item.key = snapshot.key;

  return item;
};
