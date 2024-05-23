import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { SearchdrawerComponent } from './searchdrawer/searchdrawer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MapComponent } from './map/map.component';
import { BookingVehicleComponent } from './booking-vehicle/booking-vehicle.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapquestmapComponent } from './mapquestmap/mapquestmap.component';
import { MapleafletComponent } from './mapleaflet/mapleaflet.component';

@NgModule({
  declarations: [
    HomePage,
    MapComponent,
    SearchdrawerComponent,
    BookingVehicleComponent,
    MapquestmapComponent,
    MapleafletComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    LeafletModule,
  ],
})
export class HomePageModule {}
