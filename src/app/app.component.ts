import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private appServices: AppService) {}
  ngOnInit() {
    this.getCurrentLocation();
  }
  async getCurrentLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current coordinates:', coordinates);
    this.appServices.setMapPickUpData({
      location: 'current Location',
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude,
    });
  }
}
