import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';

declare let google;
@Component({
  selector: 'app-ruta-mapa',
  templateUrl: './ruta-mapa.page.html',
  styleUrls: ['./ruta-mapa.page.scss'],
})
export class RutaMapaPage implements OnInit, AfterViewInit {
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  map: any;
  db = getDatabase();
  auth = getAuth();
  uid = this.auth.currentUser.uid;
  servicio: any = { };
  tiempoTaxi: any= { }; distancia: any= { };
  idServicio: any;
  rutaCompleta: any = { };

  currentLocation: any = {
    lat: 0,
    lng: 0
  };

  constructor(
    public alertController: AlertController,
    private geolocation: Geolocation,
    public router: Router,
  ) { }

  ngOnInit() {
    this.getServicio();
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
  }

  calculateRoute(servicio): any {
      console.log(servicio);
      this.directionsService.route(
      {
        origin: servicio.ubiTaxi,
        destination: servicio.destino,
        waypoints: [
          {
            location: this.currentLocation,
            // location: servicio.ubicCliente,
            stopover: false
          }
        ],
        travelMode: 'DRIVING',
        drivingOptions: {
          departureTime: new Date(Date.now()), // for the time N milliseconds from now.
          trafficModel: 'optimistic',
        },
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status === 'OK') {
          this.rutaCompleta = response.routes[0].legs[0];
          this.directionsDisplay.setDirections(response);
        } else {
          console.log(response);
        }
      }
    );
  }

  getServicio(){
    this.servicio = [];
    const refBD = ref(this.db, 'Usuarios/' + this.uid + '/Servicios');
    onValue(refBD, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.estatus === 'En ruta' ) {
          this.idServicio = childSnapshot.key;
          this.servicio = childData;
          this.distancia = this.servicio.distanciaRuta;
          this.tiempoTaxi = this.servicio.tiempoTaxi;
          console.log(this.servicio.distanciaRuta.text);
          this.calculateRoute(childData);
        }
      });
    }, {
      onlyOnce: true
    });
  }

  chat(){
    this.router.navigate(['message']);
  }

  cancelServicio(idServicio){
    const refBD = ref(this.db, 'Usuarios/' + this.uid + '/Servicios/' + idServicio);
    const mensajeRef = ref(this.db, '/Mensajes/' + this.uid);
    remove(refBD);
    remove(mensajeRef);
    // Llamar alerta
    this.router.navigate(['mapa']);
  }
}
