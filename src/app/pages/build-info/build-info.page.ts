import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  Build,
  Class,
  Quality,
  Type,
} from 'src/app/core/interfaces/build';
import { BuildService } from 'src/app/core/services/build-info/build.service';
import { BuildFormAddComponent } from 'src/app/shared/components/build-form/build-form-add.component';
import { AlertController } from '@ionic/angular';
import { AboutModalComponent } from 'src/app/shared/components/about-modal/about-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { UserInfo } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { deleteDoc, doc } from 'firebase/firestore';
@Component({
  selector: 'app-build-info',
  templateUrl: './build-info.page.html',
  styleUrls: ['./build-info.page.scss'],
})
export class BuildInfoPage /*implements OnInit*/ {
  constructor(
    private buildService: BuildService,
    private authSvc: AuthService,
    private alertController: AlertController,
    private modalController: ModalController,
    private translate: TranslateService
  ) {}

  user: UserInfo | null = null;
  builds: Build[] = [];
  classes: Class[] | null = null;
  types: Type[] | null = null;
  qualities: Quality[] | null = null;

  async ngOnInit() {
    try {
      this.user = await this.authSvc.me()
      this.builds = await this.buildService.getAllBuildByUser(this.user?.uid);
      this.classes = await this.buildService.getClass();
      this.types = await this.buildService.getTypes();
      this.qualities = await this.buildService.getQualities();
    } catch (error) {
      console.error('Error en la inicialización:', error);
    }
  }

  async ionViewWillEnter() {
    this.user = await this.authSvc.me();
    this.builds = await this.buildService.getAllBuildByUser(this.user?.uid);
  }

  async deleteBuild(id: string) {
    try {
      const alertBuild = await this.alertController.create({
        header: this.translate.instant('other.header'),
        subHeader: this.translate.instant('other.subheaderB'),
        message: this.translate.instant('other.message'),
        buttons: [
          {
            text: this.translate.instant('other.okay'),
            handler: async () => {
              this.buildService.deleteBuild(id)
              
              // Actualizar la lista de builds después de eliminar uno
              this.builds = this.builds.filter(build => build.idBuild !== id);
            },
          },
          this.translate.instant('other.cancel')
        ],
      });
      await alertBuild.present();
    } catch (error) {
      console.error('Error al eliminar el build:', error);
      // Aquí puedes manejar el error si es necesario
    }
  }
}
