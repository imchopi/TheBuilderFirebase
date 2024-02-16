import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import {
  Build,
  Class,
  FullItem,
  Quality,
  TestItem,
  Type,
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

  items: FullItem[] = [];

  async ngOnInit() {
    this.items = await this.buildService.getItems();
  }

  async ionViewWillEnter() {
    try {
      this.items = await this.buildService.getItems();
    } catch (error) {
      console.error('Error al obtener datos:', error);
      // Manejar el error si es necesario
    }
  }

  async deleteItem(id: string | undefined ) {
    if (id) {
      const alertItem = await this.alertController.create({
        header: this.translate.instant('other.header'),
        subHeader: this.translate.instant('other.subheader'),
        message: this.translate.instant('other.message'),
        buttons: [
          {
            text: this.translate.instant('other.okay'),
            handler: async () => {
              try {
                  await this.buildService.deleteItem(id);
                  this.items = this.items.filter(item => item.idItem !== id);

              } catch (error) {
                console.error('Error al eliminar el item:', error);
                // Manejar el error si es necesario
              }
            },
          },
          this.translate.instant('other.cancel')
        ],
      });
      await alertItem.present();
    }
  }
}
