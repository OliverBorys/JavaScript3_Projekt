import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ProductImageComponent } from '../../components/product-details/product-image/product-image.component';
import { ProductInfoComponent } from '../../components/product-details/product-info/product-info.component';
import { MissingProductComponent } from '../../components/product-details/missing-product/missing-product.component';
import { ProductSwiperComponent } from '../../components/product-details/product-swiper/product-swiper.component';


@Component({
  standalone: true,
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  imports: [
    CommonModule,
    ProductImageComponent,
    ProductInfoComponent,
    ProductSwiperComponent,
    MissingProductComponent
  ]
})
export class ProductDetailsComponent implements OnInit {
  product: any;
  loading = true;
  error = false;
  id!: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.http.get(`/api/products/${this.id}`).subscribe({
      next: (res) => {
        this.product = res;
        this.loading = false;
        document.title = this.product.productName;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
