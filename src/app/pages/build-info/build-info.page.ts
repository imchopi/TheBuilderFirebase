import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  Build,
  BuildPayload,
  Class,
  Qualities,
  Types,
} from 'src/app/core/interfaces/build';
import { BuildService } from 'src/app/core/services/build-info/build.service';
import { BuildFormAddComponent } from 'src/app/shared/components/build-form/build-form-add.component';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { User } from 'src/app/core/interfaces/user';
import { AboutModalComponent } from 'src/app/shared/components/about-modal/about-modal.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-build-info',
  templateUrl: './build-info.page.html',
  styleUrls: ['./build-info.page.scss'],
})
export class BuildInfoPage implements OnInit {
  constructor(
    private buildService: BuildService,
    private alertController: AlertController,
    private auth: AuthService,
    private modalController: ModalController,
    private translate: TranslateService
  ) {}

  user: User | null = null;
  builds: Build[] = [];
  classes: Class[] | null = null;
  types: Types[] | null = null;
  qualities: Qualities[] | null = null;

  ngOnInit() {
    this.auth.me().subscribe({
      next: (_) => {
        this.user = _;
        this.buildService
          .getAllBuildByUser(this?.user?.id)
          .subscribe((response) => {
            this.builds = response;
          });
      },
    });
    this.buildService.getClasses().subscribe((response) => {
      this.classes = response;
    });
    this.buildService.getTypes().subscribe((response) => {
      this.types = response;
    });
    this.buildService.getQualities().subscribe((response) => {
      this.qualities = response;
    });
  }

  ionViewWillEnter() {
    this.auth.me().subscribe({
      next: (_) => {
        this.user = _;
        this.buildService
          .getAllBuildByUser(this?.user?.id)
          .subscribe((response) => {
            this.builds = response;
          });
      },
    });
  }

  async deleteBuild(id: number) {
    const alertBuild = await this.alertController.create({
      header: this.translate.instant('other.header'),
      subHeader: this.translate.instant('other.subheaderB'),
      message: this.translate.instant('other.message'),
      buttons: [
        {
          text: this.translate.instant('other.okay'),
          handler: () => {
            this.buildService.deleteBuild(id).subscribe(
              (res) => {
                this.buildService
                  .getAllBuildByUser(this.user?.id)
                  .subscribe((response) => {
                    this.builds = response;
                  });
              },
            );
          },
        },
        this.translate.instant('other.cancel')
      ],
    });
    await alertBuild.present();
  }
}
