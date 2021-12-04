import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutaMapaPage } from './ruta-mapa.page';

const routes: Routes = [
  {
    path: '',
    component: RutaMapaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutaMapaPageRoutingModule {}
