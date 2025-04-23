import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.css'],
  imports: [CommonModule, FormsModule]
})
export class CategoryFilterComponent {
  @Input() categories: { id: number; categoryName: string }[] = [];
  @Input() selectedCategory: string = '';
  @Output() categoryChange = new EventEmitter<string>();

  onCategoryChange(value: string): void {
    this.categoryChange.emit(value);
  }
}
