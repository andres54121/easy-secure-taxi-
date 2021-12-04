import { environment } from 'src/environments/environment';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { getDatabase, onValue, push, ref, set } from 'firebase/database';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { AlertasService } from '../services/alertas.service';
import { LoadingService } from '../services/loading.service';

declare let google;
@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements AfterViewInit {
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  map: any;
  uid: any;
  datosRuta: any;
  db = getDatabase();
  auth = getAuth();
  directionForm: FormGroup;
  km: [];
  km2: number;
  tarifa: any;
  validacion: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Taxis = [];
  currentLocation: any = {
    lat: 0,
    lng: 0
  };
  taxiLocation: any = {
    lat: 21.146452,
    lng: -86.821208,
    tiempo: '',
    distancia: 0
  };
  constructor(
    private fb: FormBuilder,
    public alertController: AlertController,
    private geolocation: Geolocation,
    public router: Router,
    private alertasSvc: AlertasService,
    private loadingSvc: LoadingService,
  ) {
    this.uid = this.auth.currentUser.uid;
    this.getServicio();
    this.createDirectionForm();
  }

  getServicio(){
    // verifica si ya hay un servicio activo
    const refBD = ref(this.db, 'Usuarios/' + this.uid + '/Servicios');
    onValue(refBD, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.estatus === 'En ruta' ) {
          console.log('si');
          window.location.href = '/ruta-mapa' ;
        }
        console.log('no');
      });
    });
  }

  createDirectionForm() {
    this.directionForm = this.fb.group({
      destination: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    //Visualizar Mapa
    this.map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: 12,
      center: { lat: 21.161780, lng: -86.851497 },
    });
    this.directionsDisplay.setMap(this.map);
    //Ubicacion del usuario
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentLocation.lat = resp.coords.latitude;
      this.currentLocation.lng = resp.coords.longitude;
      const marker = new google.maps.Marker({
        position: this.currentLocation,
        map: this.map,
        title: 'Hello World!',
        icon: {
          url: 'assets/icon/marcador.png', // image url
          scaledSize: new google.maps.Size(40, 40), // scaled size
        }
      });
    });
    this.marcadoresTaxistas();
    // this.calculateTaxiRoute();
  }
  calculateAndDisplayRoute(formValues) {
    const that = this;
    this.directionsService.route(
      {
        origin: this.currentLocation,
        // origin: 'Playa tortugas',
        destination: formValues.destination,
        travelMode: 'DRIVING',
        drivingOptions: {
          departureTime: new Date(Date.now()), // for the time N milliseconds from now.
          trafficModel: 'optimistic',
        },
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status === 'OK') {
          this.datosRuta = response.routes[0].legs[0];
          console.log(response);
          that.directionsDisplay.setDirections(response);
          this.km = response;
          this.km2 = this.km['routes'][0]['legs'][0]['distance']['value'];
          this.presentAlert();
        } else {
          // window.alert('Direccion no encontrada ' + status);
          this.alertasSvc.notFound(status);
        }
      }
    );
  }
  async presentAlert() {
    this.loadingSvc.cargandoRuta();
    await new Promise<void>((done) => setTimeout(() => done(), 1000));
    this.tarifa = (this.km2 / 1000) * 32.5;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Tarifa asignada',
      subHeader: 'La tarifa de la ruta por ' + this.km2 / 1000 + 'km es',
      message: 'Precio estimado $' + parseFloat(this.tarifa ).toFixed(2)+ ' pesos',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Okay',
          role: 'Okay',
          handler: () => {
            this.newService();
            window.location.href = '/select-taxi/' + this.uid;
            // this.router.u;
            console.log('Confirm Okay');
          },
        },
      ],
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async marcadoresTaxistas(){
    try {
      const refBD = ref(this.db, 'Taxistas/');
      onValue(refBD, (snapshot) => {
        this.Taxis = [];
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          this.Taxis.push(childData);
          // Crear Marcador
          const pos = {
            lat: childData.lat,
            lng: childData.lng
          };
          const iconT = {
            url: 'assets/icon/u.png', // image url
            scaledSize: new google.maps.Size(50, 50), // scaled size
          };
          new google.maps.Marker({
            position: pos,
            map: this.map,
            title: childData.displayName,
            icon: iconT
          });
        });
      });
    } catch (error) {
      console.log('Error->', error);
    }
  }

  newService(){
    const refBD = ref(this.db, 'Usuarios/' + this.uid + '/Servicios/preview');
    set(refBD, {
      distanciaV: this.datosRuta.distance.value,
      distanciaT: this.datosRuta.distance.text,
      tiempoV: this.datosRuta.duration.value,
      tiempoT: this.datosRuta.duration.text,
      precio: parseFloat(this.tarifa ).toFixed(2),
      destino: this.datosRuta.end_address,
      ubiClient: this.currentLocation
    });
  }
}
