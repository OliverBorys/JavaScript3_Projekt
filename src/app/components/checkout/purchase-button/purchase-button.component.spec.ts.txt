import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseButtonComponent } from './purchase-button.component';

describe('PurchaseButtonComponent', () => {
  let component: PurchaseButtonComponent;
  let fixture: ComponentFixture<PurchaseButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
