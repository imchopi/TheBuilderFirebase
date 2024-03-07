import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Unsubscribe } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
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
export class ItemPage{
  private _items = new BehaviorSubject<FullItem[]>([]);
  public items$ = this._items.asObservable();
  private unSbc: Unsubscribe | null = null;

  constructor(
    private buildService: BuildService,
    private alertController: AlertController,
    private translate: TranslateService
  ) {
    this.unSbc = this.buildService.subscribeToCollection(
      'items',
      this._items,
      buildService.mapItems
    );
  }

  items: FullItem[] = [];

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
