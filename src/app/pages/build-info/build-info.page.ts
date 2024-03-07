import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { BuildService } from 'src/app/core/services/build-info/build.service';
import {
  Build,
  Class,
  FullItem,
  Quality,
  Type,
} from 'src/app/core/interfaces/build';
import { UserInfo } from 'src/app/core/interfaces/user';
import { Unsubscribe, deleteDoc } from 'firebase/firestore';
import { FirebaseService } from 'src/app/core/services/auth-firebase/auth-firebase.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-build-info',
  templateUrl: './build-info.page.html',
  styleUrls: ['./build-info.page.scss'],
})
export class BuildInfoPage implements OnInit {
  private _builds = new BehaviorSubject<Build[]>([]);
  public builds$ = this._builds.asObservable();
  private unSbc: Unsubscribe | null = null;

  constructor(
    private buildService: BuildService,
    private authSvc: FirebaseService,
    private alertController: AlertController,
    private translate: TranslateService,
    private sanitizer: DomSanitizer
  ) {
    this.unSbc = this.buildService.subscribeToCollection(
      'buildRegister',
      this._builds,
      buildService.mapBuilds
    );
  }

  user: UserInfo | null | undefined = null;
  builds: Build[] = [];
  items: FullItem[] = [];
  classes: Class[] | null = null;
  types: Type[] | null = null;
  qualities: Quality[] | null = null;
  imageUrl: SafeUrl | undefined;

  async ngOnInit() {
    const dynamicImageUrl = 'build.class.classImage';
    this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(dynamicImageUrl);
  }

  async ionViewWillEnter() {
    this.user = await this.authSvc.me();
  }

  async deleteBuild(id: string | undefined) {
    if (id) {
      try {
        const alertBuild = await this.alertController.create({
          header: this.translate.instant('other.header'),
          subHeader: this.translate.instant('other.subheaderB'),
          message: this.translate.instant('other.message'),
          buttons: [
            {
              text: this.translate.instant('other.okay'),
              handler: async () => {
                try {
                  await this.buildService.deleteBuild(id);
                  // Actualizar la lista de builds después de eliminar uno
                  this.builds = this.builds.filter(
                    (build) => build.idBuild !== id
                  );
                } catch (error) {
                  console.error('Error al eliminar el build:', error);
                  // Manejar el error si es necesario
                }
              },
            },
            this.translate.instant('other.cancel'),
          ],
        });
        await alertBuild.present();
      } catch (error) {
        console.error('Error al mostrar el alerta:', error);
        // Manejar el error si es necesario
      }
    } else {
      console.error('El ID del build es undefined.');
      // Manejar el caso de que el ID sea undefined, si es necesario
    }
  }
}
