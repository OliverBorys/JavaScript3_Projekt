import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryFilterComponent } from '../../components/product/category-filter/category-filter.component';
import { SortDropdownComponent } from '../../components/product/sort-dropdown/sort-dropdown.component';
import { ProductGridComponent } from '../../components/product/product-grid/product-grid.component';
import { filterProducts, sortProducts } from '../../utils/filter-utils';
import { HttpClientModule, HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
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
    this.selectedCategory = newCategory;
  }

  onLikeToggled() {
    // Trigger re-filter by shallow copying the array
    this.products = [...this.products];
  }
}
