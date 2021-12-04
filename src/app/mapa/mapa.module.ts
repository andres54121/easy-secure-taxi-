import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapaPageRoutingModule } from './mapa-routing.module';

import { MapaPage } from './mapa.page';
import { ComponentsModule } from '../components/components.module';
import {Geolocation} from '@ionic-native/geolocation/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapaPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [MapaPage],
  providers: [ Geolocation ]
})
export class MapaPageModule {}
