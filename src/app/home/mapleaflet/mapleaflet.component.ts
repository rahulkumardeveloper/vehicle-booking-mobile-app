import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { combineLatest } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { GooglemapsService } from 'src/app/services/googlemap/googlemaps.service';
import { VehiclelocationService } from 'src/app/services/vehiclelocationservices/vehiclelocation.service';
declare var H: any;
@Component({
  selector: 'app-mapleaflet',
  templateUrl: './mapleaflet.component.html',
  styleUrls: ['./mapleaflet.component.scss'],
})
export class MapleafletComponent implements OnInit {
  map!: L.Map;
  center: L.LatLngExpression = [17.4306, 78.4094];

  options: L.MapOptions = {
    zoom: 10,
    maxZoom: 18,
    minZoom: 10,
    zoomControl: false,
    preferCanvas: true,
    attributionControl: true,
    center: this.center,
  };
  vehicleLocation: any;
  pickupLocation: any;
  dropLocation: any;
  zoomValue: number = 10;
  constructor(
    private vehicleLocationService: VehiclelocationService,
    private maps: GooglemapsService,
    private renderer: Renderer2, // private track: TrackService
    private appService: AppService
  ) {}

  ngOnInit(): void {
    this.vehicleLocation = this.vehicleLocationService.vehicleLocation;
  }

  ngAfterViewInit() {
    combineLatest([
      this.appService.mapPickUpData$,
      this.appService.mapDropData$,
    ]).subscribe(([pickupData, dropData]) => {
      // Check if both pickupData and dropData have emitted values
      if (pickupData.lat != 0 && dropData.lat != 0) {
        this.pickupLocation = pickupData;
        this.dropLocation = dropData;
        console.log('this.pickupLocation', this.pickupLocation);
        console.log('this.dropLocation', this.dropLocation);
        this.onMapReady(this.map);
      }
    });
  }

  onMapReady(lMap: any) {
    this.map = lMap;
    console.log('this.map', this.map);
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);

    //source location
    if (this.pickupLocation?.lat != 0) {
      L.marker([this.pickupLocation?.lat, this.pickupLocation?.lng], {
        icon: L.icon({
          iconUrl: 'assets/pickup-location.png',
          iconSize: [30, 30],
        }),
      }).addTo(this.map);
    }

    if (this.pickupLocation?.lat != 0 && this.dropLocation?.lat != 0) {
      // destination location
      L.marker([this.dropLocation?.lat, this.dropLocation?.lng], {
        icon: L.icon({
          iconUrl: 'assets/drop-location.png',
          iconSize: [30, 30],
        }),
      }).addTo(this.map);

      L.Routing.control({
        waypoints: [
          L.latLng(this.pickupLocation?.lat, this.pickupLocation?.lng),
          L.latLng(this.dropLocation?.lat, this.dropLocation?.lng),
        ],
        createMarker: () => null,
      }).addTo(this.map);
    }
  }
  ///============================
  // @ViewChild('mapContainer') mapContainer!: ElementRef;
  // constructor() {}
  // ngOnInit(): void {}
  // ngAfterViewInit() {
  //   const initialState = { lng: 17.4306, lat: 78.4094, zoom: 10 };

  //   const leafletMap: L.Map = L.map(this.mapContainer.nativeElement).setView(
  //     [initialState.lat, initialState.lng],
  //     initialState.zoom
  //   );

  //   const isRetina = L.Browser.retina;
  //   const baseUrl =
  //     'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=YOUR_API_KEY';
  //   const retinaUrl =
  //     'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=YOUR_API_KEY';

  //   L.tileLayer(isRetina ? retinaUrl : baseUrl, {
  //     attribution:
  //       'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
  //     maxZoom: 20,
  //     id: 'osm-bright',
  //   }).addTo(leafletMap);

  //   L.marker([17.4306, 78.4094], {
  //     icon: L.icon({
  //       iconUrl: 'assets/pickup-location.png',
  //       iconSize: [30, 30],
  //       shadowSize: [50, 64],
  //     }),
  //   }).addTo(leafletMap);

  //   L.marker([17.385, 78.4867], {
  //     icon: L.icon({
  //       iconUrl: 'assets/drop-location.png',
  //       iconSize: [30, 30],
  //       shadowSize: [50, 64],
  //     }),
  //   }).addTo(leafletMap);

  //   // Add routing control
  //   L.Routing.control({
  //     waypoints: [L.latLng(17.4306, 78.4094), L.latLng(17.385, 78.4867)],
  //     routeWhileDragging: true,
  //   }).addTo(leafletMap);
  // }
}
