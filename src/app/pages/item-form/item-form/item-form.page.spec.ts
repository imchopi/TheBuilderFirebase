import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemFormPage } from './item-form.page';

describe('ItemFormPage', () => {
  let component: ItemFormPage;
  let fixture: ComponentFixture<ItemFormPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
