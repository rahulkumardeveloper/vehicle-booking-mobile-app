import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController, NavParams } from '@ionic/angular';
import { AppService } from '../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @ViewChild('pickupInput') pickupInput!: IonInput;
  @ViewChild('dropInput') dropInput!: IonInput;
  inputFocusField: any;
  cityLocationdata: any;
  pickupLocation: string = '';
  pickupLocationVal: string = '';
  pickUpSendobject: any;
  dropSendobject: any;
  filterData: Array<{ location: string }> = [];
  locationForm: FormGroup;
  pickUplocationObj: any;
  dropLocation: any;
  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams,
    private appService: AppService,
    private fb: FormBuilder,
    private elementRef: ElementRef
  ) {
    this.cityLocationdata = this.appService.locationData;

    this.locationForm = this.fb.group({
      pickupLocation: [''],
      dropLocation: [''],
    });
    // Custom validator to ensure that at least one of the locations is filled
    this.locationForm.setValidators(this.customLocationValidator());

    this.locationForm.valueChanges.subscribe((value: any) => {
      if (this.locationForm.valid) {
        // console.log('locationData', this.locationForm.value);
      } else {
        // console.log('Invalid Form');
      }
    });
  }
  customLocationValidator() {
    return (formGroup: any) => {
      const pickupLocation = formGroup.get('pickupLocation').value;
      const dropLocation = formGroup.get('dropLocation').value;

      if (!pickupLocation && !dropLocation) {
        return { atLeastOneLocationRequired: true };
      } else {
        return null;
      }
    };
  }

  ngOnInit() {
    this.inputFocusField = this.navParams.get('inputFocus');
    // console.log('inputFocusField', this.inputFocusField);
    // this.pickupLocationVal = this.navParams.get('pickUplocationData')?.location;
    this.pickUpSendobject = this.navParams.get('pickUplocationData');
    combineLatest([
      this.appService.mapPickUpData$,
      this.appService.mapDropData$,
    ]).subscribe(([pickupData, dropData]) => {
      // Check if both pickupData and dropData have emitted values
      if (pickupData && dropData) {
        this.pickUpSendobject = pickupData;
        this.dropSendobject = dropData;
        this.locationForm.patchValue({ pickupLocation: pickupData.location });
        this.locationForm.patchValue({ dropLocation: dropData.location });
      }
    });

    this.filterData = this.cityLocationdata;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      switch (this.inputFocusField) {
        case 'Drop location':
          this.dropInput.setFocus();
          break;
        case 'Pickup location':
          this.pickupInput.setFocus();
          break;
        default:
          break;
      }
    });
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

  // selectLocation(selectedLocation: any) {
  //   // debugger;
  //   console.log('selectedLocation', selectedLocation);
  //   if (this.inputFocusField == 'Pickup location') {
  //     this.pickUpSendobject = selectedLocation;
  //     this.pickupLocation = this.pickUpSendobject.location;
  //     if (this.pickupLocation != '' && this.dropLocation != '') {
  //       this.appService.setMapPickUpData(this.pickUpSendobject);
  //       this.appService.setMapDropData(this.dropSendobject);

  //       this.modalCtrl.dismiss([
  //         { pickuolocation: this.pickUpSendobject },
  //         { droplocation: this.dropSendobject },
  //       ]);
  //     } else if (this.pickupLocation != '') {
  //       this.appService.setMapPickUpData(this.pickUpSendobject);
  //       this.modalCtrl.dismiss([
  //         { pickuolocation: this.pickUpSendobject },
  //         { droplocation: this.dropSendobject },
  //       ]);
  //     }
  //   }
  //   if (this.inputFocusField == 'Drop location') {
  //     this.dropSendobject = selectedLocation;
  //     this.dropLocation = this.dropSendobject.location;

  //     if (this.pickupLocation != '' && this.dropLocation != '') {
  //       this.appService.setMapDropData(this.dropSendobject);
  //       this.modalCtrl.dismiss([
  //         { pickuolocation: this.pickUpSendobject },
  //         { droplocation: this.dropSendobject },
  //       ]);
  //     } else if (this.dropLocation != '') {
  //       this.appService.setMapDropData(selectedLocation);
  //       // this.modalCtrl.dismiss();
  //     }
  //   }
  // }

  selectLocation(selectedLocation: any) {
    if (this.inputFocusField === 'Pickup location') {
      this.pickUpSendobject = selectedLocation;
      this.pickupLocation = this.pickUpSendobject.location;
      this.appService.setMapPickUpData(this.pickUpSendobject);
      this.locationForm.patchValue({
        pickupLocation: selectedLocation.location,
      });
      this.setMapDataAndDismiss(selectedLocation);
    }
    if (this.inputFocusField === 'Drop location') {
      this.dropSendobject = selectedLocation;
      this.dropLocation = this.dropSendobject.location;
      this.appService.setMapDropData(this.dropSendobject);
      this.locationForm.patchValue({ dropLocation: selectedLocation.location });
      this.setMapDataAndDismiss(selectedLocation);
    }
  }

  private setMapDataAndDismiss(selectedLocation: any) {
    if (this.locationForm.valid) {
      this.modalCtrl.dismiss([
        { pickuolocation: this.pickUpSendobject },
        { droplocation: this.dropSendobject },
      ]);
    } else {
      console.log('not valid it will not closed');
    }
    //   if (this.pickupLocation !== '' && this.dropLocation !== '') {
    //     this.appService.setMapPickUpData(this.pickUpSendobject);
    //     this.appService.setMapDropData(this.dropSendobject);
    //   } else if (this.pickupLocation !== '') {
    //     this.appService.setMapPickUpData(this.pickUpSendobject);
    //   } else if (this.dropLocation !== '') {
    //     this.appService.setMapDropData(this.dropSendobject || selectedLocation);
    //   }
    //   this.modalCtrl.dismiss([
    //     { pickuolocation: this.pickUpSendobject },
    //     { droplocation: this.dropSendobject },
    //   ]);
  }

  filteredLocations(event: any) {
    let filteredData = [...this.cityLocationdata];

    if (this.pickupLocation != '') {
      filteredData = filteredData.filter(
        (item) =>
          item.location &&
          item.location
            .toLowerCase()
            .includes(event?.target?.value.toLowerCase())
      );
    }

    if (this.dropLocation != '') {
      filteredData = filteredData.filter(
        (item) =>
          item.location &&
          item.location
            .toLowerCase()
            .includes(event?.target?.value.toLowerCase())
      );
    }
    this.filterData = filteredData;
  }

  onFocus(focusField: any) {
    this.inputFocusField = focusField;
    // console.log('this.inputFocusField', this.inputFocusField);
  }
}
