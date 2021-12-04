import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutaMapaPageRoutingModule } from './ruta-mapa-routing.module';

import { RutaMapaPage } from './ruta-mapa.page';
import { ComponentsModule } from '../components/components.module';
import {Geolocation} from '@ionic-native/geolocation/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutaMapaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [RutaMapaPage],
  providers: [ Geolocation ]
})
export class RutaMapaPageModule {}
