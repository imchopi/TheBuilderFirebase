import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import {
  Build,
  BuildPayload,
  Class,
} from 'src/app/core/interfaces/build';
import { BuildService } from 'src/app/core/services/build-info/build.service';
@Component({
  selector: 'app-build-form',
  templateUrl: './build-form.page.html',
  styleUrls: ['./build-form.page.scss'],
})

export class BuildFormPage implements OnInit {


  constructor(
    private buildService: BuildService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  async onRegister(build: Build) {
    try {
      await this.buildService.addBuild(build);
      this.router.navigate(['/build-info']);
    } catch (error) {
      console.error('Error al agregar el build:', error);
      // Manejar el error si es necesario
    }
  }
  
}
