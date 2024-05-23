import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MenuComponent } from './menu/menu.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalPageModule } from './modal/modal.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { ItemReorderEventDetail } from '@ionic/angular';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
@NgModule({
  declarations: [AppComponent, MenuComponent],
  imports: [
    BrowserModule,
    GoogleMapsModule,
    AppRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    ModalPageModule,
    LeafletModule,
    IonicModule.forRoot(),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
