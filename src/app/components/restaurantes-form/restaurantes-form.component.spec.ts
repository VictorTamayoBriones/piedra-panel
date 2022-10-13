import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantesFormComponent } from './restaurantes-form.component';

describe('RestaurantesFormComponent', () => {
  let component: RestaurantesFormComponent;
  let fixture: ComponentFixture<RestaurantesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantesFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
