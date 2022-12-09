import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosTableComponent } from './pedidos-table.component';

describe('PedidosTableComponent', () => {
  let component: PedidosTableComponent;
  let fixture: ComponentFixture<PedidosTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidosTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
