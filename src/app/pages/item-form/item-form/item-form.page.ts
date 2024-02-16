import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FullItem, TestItem } from 'src/app/core/interfaces/build';
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

  async onRegister(item: FullItem) {
    try {
      const data = await this.buildService.addItem(item);
      console.log("Data de onRegister: " + item.itemName);
      
      this.router.navigate(['/item']);
    } catch (error) {
      console.error('Error al agregar el item:', error);
      // Manejar el error si es necesario
    }
  }
}