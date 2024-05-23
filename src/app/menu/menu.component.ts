import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  public appPages = [
    { title: 'Payment', url: '/home/payment', icon: 'mail' },
    { title: 'Promotion', url: '/home/promotion', icon: 'paper-plane' },
    { title: 'RideHistory', url: '/home/ridehistory', icon: 'heart' },
    { title: 'Support', url: '/home/support', icon: 'archive' },
    { title: 'About', url: '/home/about', icon: 'trash' },
  ];
  constructor(private modalCtrl: ModalController) {}
  async onMenuItem() {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
    });
    return await modal.present();
  }
}
