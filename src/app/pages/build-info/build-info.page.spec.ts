import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuildInfoPage } from './build-info.page';

describe('BuildInfoPage', () => {
  let component: BuildInfoPage;
  let fixture: ComponentFixture<BuildInfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BuildInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
