import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemPayload } from 'src/app/core/interfaces/build';
import { BuildService } from 'src/app/core/services/build-info/build.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.page.html',
  styleUrls: ['./item-form.page.scss'],
})
export class ItemFormPage implements OnInit {

  constructor(
    private buildService: BuildService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  onRegister(item: ItemPayload) {
    this.buildService.addItem(item).subscribe({
      next: (data) => {
        this.router.navigate(['/item']);
      },
    });
  }
}