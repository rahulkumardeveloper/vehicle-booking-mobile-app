import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root',
})
export class VehiclelocationService {
  vehicleLocation: any = [
    {
      id: 1,
      vehicleName: 'car',
      img: '/assets/car.png',
      type: 'car',
      lat: 17.4603101,
      lng: 78.3540238,
    },
    {
      id: 2,
      vehicleName: 'auto',
      img: '/assets/auto.png',
      type: 'auto',
      lat: 17.4835326,
      lng: 78.4107492,
    },

    {
      id: 3,
      vehicleName: 'bike',
      img: '/assets/bike.png',
      type: 'bike',
      lat: 17.4642996,
      lng: 78.3662422,
    },
    {
      id: 4,
      vehicleName: 'bike',
      img: '/assets/bike.png',
      type: 'bike',
      lat: 17.4703101,
      lng: 78.3740238,
    },
    {
      id: 5,
      vehicleName: 'auto',
      img: '/assets/auto.png',
      type: 'auto',
      lat: 17.521045,
      lng: 78.3235859,
    },
  ];
  vehicleListType: any = [
    {
      id: 1,
      vehicleName: 'auto',
      img: '/assets/auto.png',
      type: 'auto',
    },
    {
      id: 2,
      vehicleName: 'bike',
      img: '/assets/bike.png',
      type: 'bike',
    },
    {
      id: 3,
      vehicleName: 'car',
      img: '/assets/car.png',
      type: 'car',
    },
  ];
  vehicleLocationDataSubject = new BehaviorSubject<any>(null);
  vehicleLocationDataData$ = this.vehicleLocationDataSubject.asObservable();
  pickupLocation: any;
  constructor(private appServices: AppService) {
    // this.fetchVehicleLocation();
    this.pickupLocation = this.appServices.pickupLocationValue;
    this.simulateDataFetch();
  }

  setVehicleLocationDataSubject(data: any) {
    this.vehicleLocationDataSubject.next(data);
    // this.vehicleLocation = data;
  }

  filterVehicleLocationByType(type: string) {
    const filteredData = this.vehicleLocation.filter(
      (vehicle: any) => vehicle.type === type
    );
    this.setVehicleLocationDataSubject(filteredData);
  }

  // fetchVehicleLocation() {
  //   // Simulating periodic data fetch
  //   setInterval(() => {
  //     // Fetch new location data from your API or data source
  //     const newLocation = this.getNewLocationData();
  //     this.vehicleLocationDataSubject.next(newLocation);
  //   }, 3000); // Fetch new data every second
  // }

  // getNewLocationData() {
  //   // Replace this with actual data fetching logic
  //   this.vehicleLocation.map((vehicle: any) => {
  //     return {
  //       ...vehicle,
  //       lat: vehicle.lat + 0.01,
  //       lng: vehicle.lng + 0.01,
  //     };
  //   });
  //   // console.log('vehicle location', this.vehicleLocation);
  // }
  fetchVehicleLocation(): Observable<any[]> {
    return this.vehicleLocationDataSubject.asObservable();
  }

  private simulateDataFetch(): void {
    setInterval(() => {
      const newLocation = this.getNewLocationData();
      this.vehicleLocationDataSubject.next(newLocation);
    }, 3000);
  }

  private getNewLocationData(): any[] {
    // Replace this with actual data fetching logic
    return this.vehicleLocation.map((vehicle: any) => {
      return {
        ...vehicle,
        lat: vehicle.lat + (Math.random() - 0.5) * 0.01, // Simulate new latitude
        lng: vehicle.lng + (Math.random() - 0.5) * 0.01, // Simulate new longitude
      };
    });
  }
}
