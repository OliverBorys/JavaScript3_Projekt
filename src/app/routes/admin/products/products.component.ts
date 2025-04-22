import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';

interface Category {
  id: number;
  categoryName: string;
}

interface Product {
  id?: number;
  productName: string;
  brand: string;
  categoryId: number;
  price: number;
  image: string;
  secondaryImage1?: string;
  secondaryImage2?: string;
  secondaryImage3?: string;
  productDescription: string;
  isNew: string;
  publishingDate: string;
  categoryName?: string;
}

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductFormComponent, ConfirmDeleteModalComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  error = false;
  searchQuery: string = '';

  showModal = false;
  selectedProduct: Product | null = null;

  showDeleteModal = false;
  productToDelete: Product | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    Promise.all([
      this.http.get<Product[]>('/api/products').toPromise(),
      this.http.get<Category[]>('/api/categories').toPromise(),
    ])
      .then(([products = [], categories = []]) => {
        this.categories = categories;
        this.products = products.map((p) => ({
          ...p,
          categoryName:
            categories.find((c) => c.id === p.categoryId)?.categoryName || 'Unknown',
          isNew: p.isNew,
        }));
        this.loading = false;
      })
      .catch(() => {
        this.error = true;
        this.loading = false;
      });
  }

  sortColumn: keyof Product = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  setSort(column: keyof Product) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  get filteredProducts() {
    let filtered = this.products.filter((product) =>
      product.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    if (!this.sortColumn) return filtered;

    return filtered.sort((a, b) => {
      const dir = this.sortDirection === 'asc' ? 1 : -1;
      let aValue = a[this.sortColumn];
      let bValue = b[this.sortColumn];

      if (aValue === undefined || aValue === null) return bValue === undefined || bValue === null ? 0 : -1 * dir;
      if (bValue === undefined || bValue === null) return 1 * dir;

      if (this.sortColumn === 'isNew') {
        aValue = aValue === 'yes' ? 1 : 0;
        bValue = bValue === 'yes' ? 1 : 0;
      }
      else if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return -1 * dir;
      if (aValue > bValue) return 1 * dir;
      return 0;
    });
  }

  openAddModal() {
    this.selectedProduct = null;
    this.showModal = true;
  }

  openEditModal(product: Product) {
    this.selectedProduct = product;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedProduct = null;
  }

  handleSave(product: Product) {
    const url = product.id ? `/api/products/${product.id}` : '/api/products';
    const request = product.id
      ? this.http.put(url, product)
      : this.http.post(url, product);

    request.subscribe({
      next: () => {
        this.closeModal();
        this.loadData();
      },
      error: (err) => {
        console.error('Failed to save product:', err);
        alert('Failed to save product. Please try again.');
      },
    });
  }

  openDeleteModal(product: Product) {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  confirmDelete() {
    if (!this.productToDelete || this.productToDelete.id === undefined) return;

    const id = this.productToDelete.id;
    this.http.delete(`/api/products/${id}`).subscribe({
      next: () => {
        this.products = this.products.filter((p) => p.id !== id);
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Failed to delete product:', err);
        this.closeDeleteModal();
        alert('Failed to delete product. Please try again.');
      },
    });
  }
}
