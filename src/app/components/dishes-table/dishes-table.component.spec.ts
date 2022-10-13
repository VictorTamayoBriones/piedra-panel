import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishesTableComponent } from './dishes-table.component';

describe('DishesTableComponent', () => {
  let component: DishesTableComponent;
  let fixture: ComponentFixture<DishesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DishesTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DishesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
