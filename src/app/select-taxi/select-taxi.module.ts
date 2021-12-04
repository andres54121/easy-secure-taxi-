import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectTaxiPageRoutingModule } from './select-taxi-routing.module';

import { SelectTaxiPage } from './select-taxi.page';
import { ComponentsModule } from '../components/components.module';
import {Geolocation} from '@ionic-native/geolocation/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectTaxiPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SelectTaxiPage],
  providers: [ Geolocation ]
})
export class SelectTaxiPageModule {}
