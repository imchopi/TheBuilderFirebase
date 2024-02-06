import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Build } from 'src/app/core/interfaces/build';
import { UserInfo } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { BuildService } from 'src/app/core/services/build-info/build.service';
import { AboutModalComponent } from 'src/app/shared/components/about-modal/about-modal.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage{
  constructor(private modalController: ModalController) {}

  async openModal() {
    const modal = await this.modalController.create({
      component: AboutModalComponent,
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }
}
