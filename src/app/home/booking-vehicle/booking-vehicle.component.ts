import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { VehiclelocationService } from 'src/app/services/vehiclelocationservices/vehiclelocation.service';

@Component({
  selector: 'app-booking-vehicle',
  templateUrl: './booking-vehicle.component.html',
  styleUrls: ['./booking-vehicle.component.scss'],
})
export class BookingVehicleComponent implements OnInit {
  vehicleType: any;
  selectedVehicleType: string | null = null;
  constructor(
    private vehicleService: VehiclelocationService,
    public modalCtrl: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.vehicleType = this.vehicleService.vehicleListType;
  }

  vehicleSelection(vehicleObj: any) {
    console.log('vehicleObj', vehicleObj);
    this.selectedVehicleType = vehicleObj.type;
    this.vehicleService.filterVehicleLocationByType(vehicleObj.type);
  }
  goBack() {
    // this.modalCtrl.dismiss();
    this.router.navigate(['home']);
  }
  onBookRide() {}
}
