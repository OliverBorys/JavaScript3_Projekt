import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../product/product-card/product-card.component';

interface Product {
  id: number;
  categoryId: number;
  image: string;
  productName: string;
  brand: string;
  price: number;
}

@Component({
  selector: 'app-related-products-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './related-products-carousel.component.html',
  styleUrls: ['./related-products-carousel.component.css'],
})
export class RelatedProductsCarouselComponent implements OnInit {
  @Input() currentId!: number;
  @Input() categoryId!: number;
  filteredProducts: Product[] = [];
  loading = true;
  error = '';
  currentIndex = 0;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.currentId ?? +this.route.snapshot.paramMap.get('id')!;
    this.fetchProducts(id);
  }

  fetchProducts(id: number): void {
    this.http.get<Product[]>('/api/products').subscribe({
      next: (data) => {
        const currentProduct = data.find((product) => product.id === id);
        if (!currentProduct) {
          this.error = 'Product not found';
          this.loading = false;
          return;
        }
        this.filteredProducts = data.filter(
          (product) =>
            product.categoryId === (this.categoryId ?? currentProduct.categoryId) &&
            product.id !== id
        );
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to fetch products';
        this.loading = false;
      },
    });
  }

  slideNext(): void {
    if (this.canSlideNext()) {
      this.currentIndex++;
    }
  }

  slidePrev(): void {
    if (this.canSlidePrev()) {
      this.currentIndex--;
    }
  }

  canSlideNext(): boolean {
    const slidesPerView = this.getSlidesPerView();
    return this.currentIndex < this.filteredProducts.length - slidesPerView;
  }

  canSlidePrev(): boolean {
    return this.currentIndex > 0;
  }

  getSlidesPerView(): number { // Changed from private to public
    const width = window.innerWidth;
    if (width >= 1024) return 4;
    if (width >= 768) return 3;
    if (width >= 500) return 2;
    return 2;
  }
}
