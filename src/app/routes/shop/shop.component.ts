import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryFilterComponent } from '../../components/product/category-filter/category-filter.component';
import { SortDropdownComponent } from '../../components/product/sort-dropdown/sort-dropdown.component';
import { ProductGridComponent } from '../../components/product/product-grid/product-grid.component';
import { filterProducts, sortProducts } from '../../utils/filter-utils';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  imports: [
    CommonModule,
    HttpClientModule,
    CategoryFilterComponent,
    SortDropdownComponent,
    ProductGridComponent,
  ]
})
export class ShopComponent {
  products: any[] = [];
  categories: { id: number; categoryName: string }[] = [];
  selectedCategory: string = '';
  sort: string = 'newest';
  query: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      this.selectedCategory = params['category'] || '';
    });

    this.http.get<any[]>('/api/products').subscribe(data => this.products = data);
    this.http.get<any[]>('/api/categories').subscribe(data => this.categories = data);
  }

  get filteredAndSortedProducts(): any[] {
    const filtered = filterProducts(this.products, this.query, this.selectedCategory);
    return sortProducts(filtered, this.sort);
  }

  onSortChange(newSort: string) {
    this.sort = newSort;
  }

  onCategoryChange(newCategory: string) {
    this.router.navigate([], {
      queryParams: {
        ...this.route.snapshot.queryParams,
        category: newCategory || null
      },
      queryParamsHandling: 'merge'
    });
  }

  onLikeToggled() {
    this.products = [...this.products];
  }
}
