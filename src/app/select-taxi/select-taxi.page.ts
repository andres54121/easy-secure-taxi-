import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { getDatabase, onValue, push, query, ref, set, get } from 'firebase/database';
import { LoadingService } from '../services/loading.service';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { ActivatedRoute, Router } from '@angular/router';

declare let google;
@Component({
  selector: 'app-select-taxi',
  templateUrl: './select-taxi.page.html',
  styleUrls: ['./select-taxi.page.scss'],
})
export class SelectTaxiPage implements AfterViewInit {
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  map: any;
  datosRutaC: any = { };
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
  taxis = [];
  taxisOrd= [];
  db = getDatabase();
  uid: any;
  refBD = ref(this.db, 'Taxistas');

  constructor(
    private loadingSvc: LoadingService,
    private geolocation: Geolocation,
    public router: Router,
    private route: ActivatedRoute,
  ) {
    this.uid = this.route.snapshot.paramMap.get('uid');
    this.getServicio();
  }

  getServicio(){
    // verifica si ya hay un servicio activo
    const refBD = ref(this.db, 'Usuarios/' + this.uid + '/Servicios');
    onValue(refBD, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.estatus === 'En ruta' ) {
          console.log('si');
          this.router.navigate(['ruta-mapa']);
          window.location.href = '/ruta-mapa' ;
        }
        console.log('no');
      });
    });
  }

  async getPreview(){
    const refBD = ref(this.db, 'Usuarios/' + this.uid + '/Servicios/preview');
    await get(refBD).then((snapshot) => {
      if (snapshot.exists()) {
        this.datosRutaC = snapshot.val();
      } else {
        console.log('No data available');
      }
    }).catch((error) => {
      console.error(error);
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
    });
    this.taxistaDispo();
    this.getPreview();
    this.verRuta();
  }

  newService(taxi){
    const auth = getAuth();
    this.uid = auth.currentUser.uid;
    const refBD = ref(this.db, 'Usuarios/' + this.uid + '/Servicios/');
    const newService = push(refBD);
    set(newService, {
      distanciaRuta: {
        value: this.datosRutaC.distanciaV,
        text: this.datosRutaC.distanciaT
      },
      tiempoRuta: {
        value: this.datosRutaC.tiempoV,
        text: this.datosRutaC.tiempoT
      },
      precio: this.datosRutaC.precio,
      destino: this.datosRutaC.destino,
      ubicCliente: this.currentLocation,
      ubiTaxi: {
        lat: taxi.lat,
        lng: taxi.lng,
      },
      tiempoTaxi: taxi.tiempo,
      estatus: 'En ruta'
    });
    const mensajeRef = ref(this.db, '/Mensajes/' + this.uid);
    const newmensaj = push(mensajeRef);
    set(newmensaj, {
        mensaje: 'Saludos, me estoy dirijiendo a su ubicación',
        nombre: taxi.displayName
    });
    this.router.navigate(['ruta-mapa']);
  }

  async taxistaDispo(){
    this.loadingSvc.cargando();
    try {
      await onValue(this.refBD, (snapshot) => {
        this.taxis = [];
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          // console.log(childData);
          this.calculateTaxiRoute(childData);
        });
        this.ordenar();
      });
    } catch (error) {
      console.log('Error->', error);
    }
    this.loadingSvc.dismiss();
    this.ordenar();
  }

  calculateRoute(preiew): any {
    console.log(preiew.ubiClient);
    this.directionsService.route(
      {
        origin: preiew.ubiClient,
        destination: preiew.destino,
        travelMode: 'DRIVING',
        drivingOptions: {
          departureTime: new Date(Date.now()), // for the time N milliseconds from now.
          trafficModel: 'optimistic',
        },
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status === 'OK') {
          this.directionsDisplay.setDirections(response);
        } else {
          this.taxis = [];
        }
      }
    );
  }

  calculateTaxiRoute(taxi): any {
    // console.log(this.currentLocation);
    this.directionsService.route(
      {
        origin: taxi.lat + ' ' + taxi.lng,
        destination: this.currentLocation,
        travelMode: 'DRIVING',
        drivingOptions: {
          departureTime: new Date(Date.now()), // for the time N milliseconds from now.
          trafficModel: 'optimistic',
        },
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status === 'OK') {
          const datosRuta = response.routes[0].legs[0];
          // console.log(response.routes[0]);
          this.taxis.push({
            calificacion: taxi.calificacion,
            displayName: taxi.displayName,
            lat: taxi.lat,
            lng: taxi.lng,
            photoURL: taxi.photoURL,
            distancia: datosRuta.distance,
            tiempo: datosRuta.duration,
            ord: datosRuta.duration.value,
            rutaT: response
          });
        } else {
          this.taxis = [];
        }
      }
    );
  }

  dibujarRuta(rutaT){
    this.directionsDisplay.setDirections(rutaT);
  }

  ordenar(){
    this.taxisOrd = this.taxis;
    this.taxisOrd.sort((a, b) => {
      // 1st property, sort by count
      if (a.ord > b.ord){
        return 1;
      }
      if (a.ord < b.ord){
        return -1;
      }
      return 0;
  });
  }

  async verRuta(){
    await new Promise<void>((done) => setTimeout(() => done(), 2500));
    console.log(this.datosRutaC);
    this.calculateRoute(this.datosRutaC);
  }

  formatoTiempo(taxi){
    const tTo = parseFloat(((taxi.tiempo.value + this.datosRutaC.tiempoV)/60).toString()).toFixed(0);
    return tTo;
  }
}
