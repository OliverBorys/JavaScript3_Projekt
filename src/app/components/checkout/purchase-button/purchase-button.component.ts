import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { clearCart } from '../../../utils/local-storage-utils';
import { HeaderService } from '../../header/header.service';

@Component({
  selector: 'app-purchase-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './purchase-button.component.html',
  styleUrls: ['./purchase-button.component.css']
})
export class PurchaseButtonComponent {
  showModal = false;

  constructor(private headerService: HeaderService) {}

  handlePurchase(): void {
    this.showModal = true;
  }

  handleBackToHome(): void {
    clearCart();
    this.headerService.notifyCartChanged();
    this.headerService.openCartTemporarily();
  }
}
