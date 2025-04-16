import { Component } from '@angular/core';
import { ProductGridComponent } from '../../components/checkout/product-grid/product-grid.component';
import { PaymentFormComponent } from '../../components/checkout/payment-form/payment-form.component';
import { PurchaseButtonComponent } from '../../components/checkout/purchase-button/purchase-button.component';

@Component({
  selector: 'app-checkout',
  imports: [ProductGridComponent, PaymentFormComponent, PurchaseButtonComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

}
