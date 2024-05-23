import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { GooglemapsService } from 'src/app/services/googlemap/googlemaps.service';
import { VehiclelocationService } from 'src/app/services/vehiclelocationservices/vehiclelocation.service';

declare var H: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @ViewChild('map', { static: true }) mapElementRef!: ElementRef<any>;
  googleMaps: any;
  source: any = {};
  dest: any = {};
  map: any;
  directionsService: any;
  directionsDisplay: any;
  source_marker: any;
  destination_marker: any;
  trackSub: any;
  track: any;
  pickUpResponce: any;
  vehicleLocation: any;
  pickupLocation: any;
  dropLocation: any;
  route: any;
  zoomValue: number = 12;
  vehicle_marker: any;
  constructor(
    private maps: GooglemapsService,
    private renderer: Renderer2, // private track: TrackService
    private appService: AppService,
    private vehicleLocationService: VehiclelocationService
  ) {}

  ngOnInit() {
    this.vehicleLocation = this.vehicleLocationService.vehicleLocation;
    // this.loadMap();
    // this.appService.mapPickUpData$.subscribe((data: any) => {
    //   console.log('Received data:', data);
    //   // Use the received data here
    //   this.mapPickUpdata = data;
    //   // You may also call a method to update the map
    //   this.loadMap();
    // });
    // this.trackSub = this.track.getLocation().subscribe({
    //   next: (data: any) => {
    //     console.log(data);
    //     this.source = data?.source;
    //     if (!this.dest?.lat) {
    //       this.dest = data?.destination;
    //       this.loadMap();
    //     } else {
    //       // update marker & route
    //       this.changeMarkerPosition(this.source);
    //     }
    //   },
    // });
  }

  ngAfterViewInit() {
    combineLatest([
      this.appService.mapPickUpData$,
      this.appService.mapDropData$,
    ]).subscribe(([pickupData, dropData]) => {
      // Check if both pickupData and dropData have emitted values
      if (pickupData && dropData) {
        this.pickupLocation = pickupData;
        this.dropLocation = dropData;
        console.log('this.pickupLocation', this.pickupLocation);
        console.log('this.dropLocation', this.dropLocation);
        if (
          this.pickupLocation &&
          this.dropLocation.lat != 0 &&
          this.vehicleLocation
        ) {
          console.log('vehicle design');
          this.zoomValue = 13;
        }
        // Call loadMap function
        if (this.dropLocation.location != '')
          this.loadMap(
            this.pickupLocation,
            this.dropLocation,
            this.vehicleLocation,
            this.zoomValue
          );
      }
    });

    this.loadMap(
      this.pickupLocation,
      this.dropLocation,
      this.vehicleLocation,
      this.zoomValue
    );
  }
  //new
  async loadMap(
    pickupLocation: any,
    dropLocation: any,
    vehicleLocation: any,
    zoomValue: number
  ) {
    try {
      console.log('map');
      let googleMaps: any = await this.maps.loadGoogleMaps();
      const mapEl = this.mapElementRef.nativeElement;
      if (pickupLocation) {
        this.map = new googleMaps.Map(mapEl, {
          center: {
            lat: pickupLocation?.lat,
            lng: pickupLocation?.lng,
          },
          disableDefaultUI: true,
          zoom: zoomValue,
        });
      }
      this.directionsService = new googleMaps.DirectionsService();
      this.directionsDisplay = new googleMaps.DirectionsRenderer();

      const sourceIconUrl = 'assets/pickup-location.png';
      const destinationIconUrl = 'assets/drop-location.png';
      const car = 'assets/car.png';
      const bike = 'assets/bike.png';
      const auto = 'assets/auto.png';

      const source_position = new googleMaps.LatLng(
        pickupLocation?.lat,
        pickupLocation?.lng
      );

      const destination_position = new googleMaps.LatLng(
        dropLocation?.lat,
        dropLocation?.lng
      );

      const source_icon = {
        url: sourceIconUrl,
        scaledSize: new googleMaps.Size(30, 30), // scaled size
        origin: new googleMaps.Point(0, 0), // origin
        anchor: new googleMaps.Point(0, 0), // anchor
      };
      const destination_icon = {
        url: destinationIconUrl,
        scaledSize: new googleMaps.Size(30, 30), // scaled size
        origin: new googleMaps.Point(0, 0), // origin
        anchor: new googleMaps.Point(0, 0), // anchor
      };
      this.source_marker = new googleMaps.Marker({
        map: this.map,
        position: source_position,
        animation: googleMaps.Animation.DROP,
        icon: source_icon,
      });

      this.destination_marker = new googleMaps.Marker({
        map: this.map,
        position: destination_position,
        animation: googleMaps.Animation.DROP,
        icon: destination_icon,
      });
      //
      this.vehicleLocation.forEach((vehicle: any) => {
        // Create a LatLng object for the vehicle's position
        const vehiclePosition = new googleMaps.LatLng(vehicle.lat, vehicle.lng);

        // Create an icon for the vehicle
        const vehicleIcon = {
          url: vehicle.img,
          scaledSize: new googleMaps.Size(30, 30), // scaled size
          origin: new googleMaps.Point(0, 0), // origin
          anchor: new googleMaps.Point(15, 15), // anchor point at the center of the icon
        };

        // Create a marker for the vehicle
        if (this.dropLocation.lat != 0) {
          const vehicleMarker = new googleMaps.Marker({
            map: this.map,
            position: vehiclePosition,
            animation: googleMaps.Animation.DROP,
            icon: vehicleIcon,
          });
        }
      });
      //

      this.source_marker.setMap(this.map);
      this.destination_marker.setMap(this.map);

      this.directionsDisplay.setMap(this.map);
      this.directionsDisplay.setOptions({
        polylineOptions: {
          strokeWeight: 4,
          strokeOpacity: 1,
          strokeColor: 'blue',
        },
        suppressMarkers: true,
      });
      // Define route coordinates
      const routeCoordinates = [
        { lat: this.pickupLocation?.lat, lng: this.pickupLocation?.lng }, // source location
        { lat: this.dropLocation?.lat, lng: this.dropLocation?.lng }, // destination
      ];

      this.route = new google.maps.Polyline({
        path: routeCoordinates,
        geodesic: true,
        strokeColor: 'blue',
        strokeOpacity: 1.0,
        strokeWeight: 5,
      });

      if (this.dropLocation.lat != 0) {
        // await this.drawRoute();
        this.route.setMap(this.map);
      }

      this.map.setCenter(source_position);
      this.renderer.addClass(mapEl, 'visible');
    } catch (e) {
      console.log('error', e);
    }
  }

  drawRoute() {
    // this.directionsService.route(
    //   {
    //     origin: this.pickupLocation,
    //     destination: this.dropLocation,
    //     travelMode: 'DRIVING',
    //     provideRouteAlternatives: true,
    //   },
    //   (response: any, status: any) => {
    //     if (status === 'OK') {
    //       this.directionsDisplay.setDirections(response);
    //       console.log('response: ', response);
    //       const directionsData = response.routes[0].legs[0];
    //       console.log('directionsData', directionsData);
    //       const duration = directionsData.duration.text;
    //       console.log('duration', duration);
    //     } else {
    //       console.log('status', status);
    //     }
    //   }
    // );
  }

  changeMarkerPosition(data: any) {
    const newPosition = { lat: data?.lat, lng: data?.lng }; // Set the new marker position coordinates
    this.source_marker.setPosition(newPosition);
    this.map.panTo(newPosition); // Pan the map to the new marker position
    this.drawRoute();
  }

  ngOnDestroy(): void {
    if (this.trackSub) this.trackSub.unsubscribe();
  }
}
