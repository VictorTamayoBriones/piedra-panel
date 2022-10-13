import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantesTableComponent } from './restaurantes-table.component';

describe('RestaurantesTableComponent', () => {
  let component: RestaurantesTableComponent;
  let fixture: ComponentFixture<RestaurantesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantesTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
