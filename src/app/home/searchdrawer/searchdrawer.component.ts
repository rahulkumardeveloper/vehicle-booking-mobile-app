import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GestureController, ModalController, Platform } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { ModalPage } from 'src/app/modal/modal.page';

@Component({
  selector: 'app-searchdrawer',
  templateUrl: './searchdrawer.component.html',
  styleUrls: ['./searchdrawer.component.scss'],
})
export class SearchdrawerComponent implements AfterViewInit {
  @ViewChild('drawer', { read: ElementRef }) drawer: ElementRef | undefined;
  @Output('openStateChanges') openState: EventEmitter<boolean> =
    new EventEmitter();
  isopen = false;
  openHeight = 0;
  isSubmitted = false;
  openModal = true;
  toolbarHidden: boolean = false;
  filterData: Array<{ location: string }> = [];
  constructor(
    private plt: Platform,
    private gestureContoller: GestureController,
    private fb: FormBuilder,
    public modalCtrl: ModalController,
    private appService: AppService
  ) {
    this.filterData = this.appService.locationData;
  }

  ngOnInit() {}
  async ngAfterViewInit() {
    const drawer = this.drawer?.nativeElement;
    this.openHeight = (this.plt.height() / 100) * 70;
    const gesture = await this.gestureContoller.create({
      el: drawer,
      gestureName: 'swipe',
      direction: 'y',
      onMove: (ev) => {
        // console.log(ev);
        if (ev.deltaY < -this.openHeight) {
          return;
        }
        drawer.style.transform = `translateY(${ev.deltaY}px)`;
      },
      onEnd: (ev) => {
        if (ev.deltaY < -50 && !this.isopen) {
          drawer.style.transition = '.4s ease-out';
          drawer.style.transform = `translateY(${-this.openHeight}px)`;
          this.openState.emit(true);
          this.isopen = true;
        } else if (ev.deltaY > 50 && this.isopen) {
          drawer.style.transition = '.4s ease-out';
          drawer.style.transform = '';
          this.openState.emit(false);
          this.isopen = false;
        }
      },
    });
    gesture.enable(true);
  }

  vehicleChanges(vehicle: any) {
    alert(vehicle);
  }
  async onpickDropModal(drop: any) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: {
        inputFocus: 'Drop location',
      },
    });
    return await modal.present();
  }
  async selectLocation(selectedLocation: any) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: {
        inputFocus: 'Drop location',
        droplocation: selectedLocation,
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
}
