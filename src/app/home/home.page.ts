import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalPage } from '../modal/modal.page';
import { ModalController } from '@ionic/angular';
import { AppService } from '../app.service';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.page.html',
  styleUrls: ['./Home.page.scss'],
})
export class HomePage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  openHeight: any;
  isSubmitted = false;
  openModal = true;
  mapPickUpdata: any;
  currentLocation: any = '';
  pickupLocation: any;
  dropLocation: any;
  filterData: Array<{ location: string }> = [];
  pickUpDropLocationValueStatus: boolean = false;
  constructor(
    private fb: FormBuilder,
    public modalCtrl: ModalController,
    private appService: AppService,
    private router: Router
  ) {
    this.filterData = this.appService.locationData;
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.appService.mapPickUpData$.subscribe((data: any) => {
      this.pickupLocation = data;
      this.currentLocation = this.pickupLocation?.location;
    });
    // console.log('home.pickupLocation ', this.pickupLocation);

    //new
    this.appService.mapDropData$.subscribe((data: any) => {
      this.dropLocation = data;
    });
    // console.log('home.dropLocation ', this.dropLocation);
  }
  ngAfterViewInit() {}

  tooglebackdrop(event: any) {}

  async onpickDropModal(selectedLocation: any, inputBoxfield: any) {
    // this.router.navigate(['home/vehiclebooking']);
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: {
        inputFocus: inputBoxfield,
        pickUplocationData: selectedLocation,
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log('data coming from pick up model closed ', data);
      if (data && data.data) {
        let pickUpLocation = undefined;
        let dropLocation = undefined;
        let locationsArray = data.data;
        locationsArray.forEach((location: any) => {
          if (location.pickuolocation) {
            pickUpLocation = location.pickuolocation.location;
          }
          if (location.droplocation) {
            dropLocation = location.droplocation.location;
          }
        });
        if (pickUpLocation && dropLocation) {
          this.pickUpDropLocationValueStatus = true;
          console.log('***', this.pickUpDropLocationValueStatus);
        } else if (pickUpLocation) {
          this.pickUpDropLocationValueStatus = false;
          console.log('***', this.pickUpDropLocationValueStatus);
        } else if (dropLocation) {
          this.pickUpDropLocationValueStatus = false;
          console.log('***', this.pickUpDropLocationValueStatus);
        } else {
          this.pickUpDropLocationValueStatus = false;
          console.log('***', this.pickUpDropLocationValueStatus);
        }
      }
    });
    return await modal.present();
  }
  onSubmit() {}
  ////////////////////////////////////
  vehicleChanges(vehicle: any) {
    alert(vehicle);
  }
  async selectLocation(selectedLocation: any) {
    this.appService.setMapDropData(selectedLocation);

    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: {
        inputFocus: 'Drop location',
      },
    });
    modal.onDidDismiss().then((data) => {
      // Handle the data received from the modal here
      console.log('Data received from modal:', data);
      if (data && data.data) {
      }
    });
    return await modal.present();
  }
  onCancelSearch(event: any) {
    console.log('cancel value', event.target.value);
  }
}
