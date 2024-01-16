import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuildFormPage } from './build-form.page';

describe('BuildFormPage', () => {
  let component: BuildFormPage;
  let fixture: ComponentFixture<BuildFormPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BuildFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
