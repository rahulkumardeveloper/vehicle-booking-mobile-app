import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as L from 'leaflet';
import { combineLatest } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { ModalPage } from 'src/app/modal/modal.page';
import { VehiclelocationService } from 'src/app/services/vehiclelocationservices/vehiclelocation.service';
import { gsap } from 'gsap';
@Component({
  selector: 'app-mapquestmap',
  templateUrl: './mapquestmap.component.html',
  styleUrls: ['./mapquestmap.component.scss'],
})
export class MapquestmapComponent implements AfterViewInit {
  @ViewChild('map', { static: true }) mapContainer!: ElementRef<HTMLElement>;
  leafletMap: L.Map;
  vehicleLocation: any;
  pickupLocation: any;
  dropLocation: any;
  zoomValue: number = 13;
  vehicleLocationSubscription: any;
  private markers: L.Marker[] = [];
  constructor(
    private appService: AppService,
    private vehicleLocationService: VehiclelocationService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    // this.vehicleLocation = this.vehicleLocationService.vehicleLocation;
  }

  ngAfterViewInit(): void {
    combineLatest([
      this.appService.mapPickUpData$,
      this.appService.mapDropData$,
      // this.vehicleLocationService.vehicleLocationDataData$,
    ]).subscribe(
      ([
        pickupData,
        dropData,
        //  vehicleLocationData
      ]) => {
        // Check if both pickupData and dropData have emitted values
        if (pickupData && dropData) {
          this.pickupLocation = pickupData;
          this.dropLocation = dropData;
          console.log('this.pickupLocation', this.pickupLocation);
          console.log('this.dropLocation', this.dropLocation);
          if (this.pickupLocation && this.dropLocation.lat == 0) {
            console.log('vehicle design');
            this.initializeMap(
              this.pickupLocation,
              this.dropLocation,
              this.vehicleLocation,
              this.zoomValue
            );
          }
          // Call loadMap function
          if (this.dropLocation.lat != 0) {
            // this.vehicleLocation = vehicleLocationData;
            this.initializeMap(
              this.pickupLocation,
              this.dropLocation,
              this.vehicleLocation,
              this.zoomValue
            );
            this.vehicleLocationSubcribe();
          }
        }
      }
    );
    this.initializeMap(
      this.pickupLocation,
      this.dropLocation,
      this.vehicleLocation,
      this.zoomValue
    );
    // this.vehicleLocationSubcribe();
  }

  initializeMap(
    pickupLocation: any,
    dropLocation: any,
    vehicleLocation: any,
    zoomValue: number
  ): void {
    console.log('this.map');
    if (this.leafletMap) {
      this.leafletMap.remove();
    }
    const initialState = pickupLocation;
    this.leafletMap = L.map(this.mapContainer.nativeElement).setView(
      [initialState.lat, initialState.lng],
      zoomValue
    );

    const isRetina = L.Browser.retina;
    const baseUrl =
      'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=977011f85b204ee09ebcb5d6c0070c65';
    const retinaUrl =
      'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=977011f85b204ee09ebcb5d6c0070c65';

    L.tileLayer(isRetina ? retinaUrl : baseUrl, {
      attribution:
        'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
      maxZoom: 20,
    }).addTo(this.leafletMap);

    if (pickupLocation?.lat != 0) {
      let pickupMarker = L.marker([pickupLocation?.lat, pickupLocation?.lng], {
        icon: L.icon({
          iconUrl: 'assets/pickup-location.png',
          iconSize: [30, 30],
        }),
      })
        .bindPopup(
          `<b>PickUp Location:</b><br> ${this.pickupLocation.location}<ion-icon name="create-outline" class="edit-button"></ion-icon>`
        )
        .addTo(this.leafletMap);
      // pickupMarker.openPopup();
      // pickupMarker.on('click', () =>
      //   this.onMarkerClick(this.pickupLocation, 'Pickup Location')
      // );

      pickupMarker.on('popupopen', (popup: any) => {
        const contentDiv = popup.popup._contentNode;
        const editButton = contentDiv.querySelector('.edit-button');
        if (editButton) {
          editButton.addEventListener('click', () => {
            this.onEditLocation();
          });
        }
      });
    }

    if (dropLocation?.lat != 0) {
      // destination location
      let dropMarker = L.marker([dropLocation?.lat, dropLocation?.lng], {
        icon: L.icon({
          iconUrl: 'assets/drop-location.png',
          iconSize: [30, 30],
        }),
      })
        .bindPopup(
          `<b>Drop Location:</b><br> ${this.dropLocation.location}<br> <ion-icon name="create-outline" class="edit-button"></ion-icon>`
        )
        .addTo(this.leafletMap);
      // dropMarker.openPopup();
      dropMarker.on('popupopen', (popup: any) => {
        const contentDiv = popup.popup._contentNode;
        const editButton = contentDiv.querySelector('.edit-button');
        if (editButton) {
          editButton.addEventListener('click', () => {
            this.onEditLocation();
          });
        }
      });
      // dropMarker.on('click', () =>
      //   this.onMarkerClick(this.dropLocation, 'Drop Location')
      // );

      // this.vehicleLocation.forEach((vehicle: any) => {
      //   let dropMarker = L.marker([vehicle?.lat, vehicle?.lng], {
      //     icon: L.icon({
      //       iconUrl: vehicle.img,
      //       iconSize: [30, 30],
      //     }),
      //   }).addTo(this.leafletMap);
      // });

      L.Routing.control({
        waypoints: [
          L.latLng(pickupLocation?.lat, pickupLocation?.lng),
          L.latLng(dropLocation?.lat, dropLocation?.lng),
        ],
        createMarker: () => null,
      }).addTo(this.leafletMap);
    }
  }
  async onMarkerClick(location: any, type: string) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: {
        inputFocus: type,
        locationData: location,
      },
    });
    return await modal.present();
  }

  // vehicleLocationSubcribe() {
  // this.vehicleLocationService.vehicleLocationDataData$.subscribe(
  //   (vehicleLocationData: any) => {
  //     this.vehicleLocation = vehicleLocationData;
  //     console.log('this.vehicleLocation', this.vehicleLocation);
  //   }
  // );
  // }
  private vehicleLocationSubcribe(): void {
    if (this.dropLocation.lat != 0) {
      this.vehicleLocationSubscription = this.vehicleLocationService
        .fetchVehicleLocation()
        .subscribe(
          (vehicleLocations: any[]) => {
            this.clearMarkers();
            vehicleLocations.forEach((vehicle: any) => {
              let dropMarker = L.marker([vehicle?.lat, vehicle?.lng], {
                icon: L.icon({
                  iconUrl: vehicle.img,
                  iconSize: [30, 30],
                }),
              }).addTo(this.leafletMap);
              this.markers.push(dropMarker);
            });
          },
          (error) => {
            console.error('Error fetching vehicle locations:', error);
          }
        );
    }
  }
  onEditLocation() {
    this.onMarkerClick(this.pickupLocation, 'Pickup Location');
  }
  private clearMarkers(): void {
    this.markers.forEach((marker) => {
      this.leafletMap.removeLayer(marker);
    });
    this.markers = []; // Clear the marker array
  }
}
