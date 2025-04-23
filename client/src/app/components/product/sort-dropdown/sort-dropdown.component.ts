import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-sort-dropdown',
  templateUrl: './sort-dropdown.component.html',
  styleUrls: ['./sort-dropdown.component.css'],
  imports: [CommonModule, FormsModule]
})
export class SortDropdownComponent {
  @Input() sort: string = 'newest';
  @Output() sortChange = new EventEmitter<string>();

  onSortChange(value: string): void {
    this.sortChange.emit(value);
  }
}
