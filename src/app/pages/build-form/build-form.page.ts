import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import {
  Build,
  BuildPayload,
  Class,
  Item,
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

  onRegister(build: BuildPayload) {
    this.buildService.addBuild(build).subscribe({
      next: (data) => {
        this.router.navigate(['/build-info']);
      },
      error: (err) => {
      },
    });
  }
  
}
