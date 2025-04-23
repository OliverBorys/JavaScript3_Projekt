import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CategoryFilterComponent } from '../../components/product/category-filter/category-filter.component';
import { SortDropdownComponent } from '../../components/product/sort-dropdown/sort-dropdown.component';
import { ProductGridComponent } from '../../components/product/product-grid/product-grid.component';
import { filterProducts, sortProducts } from '../../utils/filter-utils';
import { Title } from '@angular/platform-browser';


@Component({
  standalone: true,
  selector: 'app-search',
  imports: [
    CommonModule,
    CategoryFilterComponent,
    SortDropdownComponent,
    ProductGridComponent,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  products: any[] = [];
  categories: { id: number; categoryName: string }[] = [];
  selectedCategory = '';
  sort = 'newest';
  query = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.http.get<any[]>('/api/products').subscribe((data) => (this.products = data));
    this.http.get<any[]>('/api/categories').subscribe((data) => (this.categories = data));

    this.route.queryParams.subscribe((params) => {
      this.query = params['q'] || '';
      this.updateTitle();
    });
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

  onLikeToggled() {}

  private updateTitle(): void {
    const title = this.query
      ? `Search results for: ${this.query}`
      : 'Search';
    this.titleService.setTitle(title);
  }
}
