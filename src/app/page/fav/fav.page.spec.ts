import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavPage } from './fav.page';

describe('FavPage', () => {
  let component: FavPage;
  let fixture: ComponentFixture<FavPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FavPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
