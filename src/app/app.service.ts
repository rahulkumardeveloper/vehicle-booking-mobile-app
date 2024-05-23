import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  //new
  pickupLocationValue: any = {
    location: 'Hafeezpet',
    lat: 17.4852973,
    lng: 78.3481803,
  };
  //new
  dropLocationValue: any = {
    location: '',
    lat: 0,
    lng: 0,
  };
  //new
  pickupDropLocationData: any = [
    {
      pickupLocationData: {
        location: 'Hafeezpet',
        lat: 17.4852973,
        lng: 78.3481803,
      },
    },
    {
      dropLocationData: {
        location: 'Lingampally',
        lat: 0,
        lng: 0,
      },
    },
  ];
  // mapPickUpDataSubject = new BehaviorSubject<any>(this.pickupDropLocationData);
  mapPickUpDataSubject = new BehaviorSubject<any>(this.pickupLocationValue);
  mapPickUpData$ = this.mapPickUpDataSubject.asObservable();
  //new
  mapDropDataSubject = new BehaviorSubject<any>(this.dropLocationValue);
  mapDropData$ = this.mapDropDataSubject.asObservable();
  //new
  locationData: any = [
    {
      location: 'IBase IT',
      lat: 17.4557863,
      lng: 78.3735626,
    },
    {
      location: 'Jubilee Hills',
      lat: 17.4306,
      lng: 78.4094,
    },
    {
      location: 'Banjara Hills',
      lat: 17.4157,
      lng: 78.4347,
    },
    {
      location: 'HITEC City',
      lat: 17.4479,
      lng: 78.3762,
    },
    {
      location: 'Madhapur',
      lat: 17.4433,
      lng: 78.3916,
    },
    {
      location: 'Secunderabad',
      lat: 17.4422,
      lng: 78.4986,
    },
    {
      location: 'Begumpet',
      lat: 17.4445,
      lng: 78.4596,
    },
    {
      location: 'Ameerpet',
      lat: 17.4375,
      lng: 78.4483,
    },
    {
      location: 'Kukatpally',
      lat: 17.4948,
      lng: 78.3996,
    },
    {
      location: 'Charminar',
      lat: 17.3616,
      lng: 78.4747,
    },
    {
      location: 'Lingampally',
      lat: 17.4892656,
      lng: 78.313889,
    },
    {
      location: 'Hafeezpet',
      lat: 17.4852973,
      lng: 78.3481803,
    },
  ];

  constructor() {}

  setMapPickUpData(data: any) {
    this.mapPickUpDataSubject.next(data);
  }
  setMapDropData(data: any) {
    this.mapDropDataSubject.next(data);
  }
}
