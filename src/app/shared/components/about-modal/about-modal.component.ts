import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Browser } from '@capacitor/browser'

@Component({
  selector: 'app-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.scss'],
})
export class AboutModalComponent {
  constructor(
    private modalController: ModalController,
  ) {}

  async openUrl(url: string) {
    await Browser.open({ url });
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
