import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import {
  Build,
  Class,
  Item,
  Qualities,
  Types,
} from 'src/app/core/interfaces/build';
import { BuildService } from 'src/app/core/services/build-info/build.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {
  constructor(
    private buildService: BuildService,
    private alertController: AlertController,
    private translate: TranslateService
  ) {}

  items: Item[] = [];
  types: Types[] | null = null;
  qualities: Qualities[] | null = null;

  ngOnInit() {
    this.buildService.getItems().subscribe((response) => {
      this.items = response;
    });
    this.buildService.getTypes().subscribe((response) => {
      this.types = response;
    });
    this.buildService.getQualities().subscribe((response) => {
      this.qualities = response;
    });
  }

  ionViewWillEnter() {
    this.buildService.getItems().subscribe((response) => {
      this.items = response;
    });
  }

  async deleteItem(id: number) {
    const alertItem = await this.alertController.create({
      header: this.translate.instant('other.header'),
      subHeader: this.translate.instant('other.subheader'),
      message: this.translate.instant('other.message'),
      buttons: [
        {
          text: this.translate.instant('other.okay'),
          handler: () => {
            this.buildService.deleteItem(id).subscribe((res) => {
              this.buildService.getItems().subscribe((response) => {
                this.items = response;
              });
            });
          },
        },
        this.translate.instant('other.cancel')
      ],
    });
    await alertItem.present();
  }
}
