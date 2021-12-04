import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectTaxiPage } from './select-taxi.page';

const routes: Routes = [
  {
    path: '',
    component: SelectTaxiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectTaxiPageRoutingModule {}
