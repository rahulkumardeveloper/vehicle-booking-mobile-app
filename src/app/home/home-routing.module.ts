import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { BookingVehicleComponent } from './booking-vehicle/booking-vehicle.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'vehicleBooking',
    component: BookingVehicleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
