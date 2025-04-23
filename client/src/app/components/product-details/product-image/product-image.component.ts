import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-image.component.html',
  styleUrls: ['./product-image.component.css'],
})
export class ProductImageComponent {
  @Input() product: any;
  currentIndex = 0;

  get images(): string[] {
    if (!this.product) return [];
    return [
      this.product.image,
      this.product.secondaryImage1,
      this.product.secondaryImage2,
      this.product.secondaryImage3,
    ].filter(Boolean);
  }

  nextImage(): void {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  prevImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1;
    }
  }

  goToImage(index: number): void {
    this.currentIndex = index;
  }
}
