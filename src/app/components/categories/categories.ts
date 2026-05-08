import { Component, input, output } from '@angular/core';
import { Category } from '../../models/categoryModel';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  categories = input<Category[]>([]);
  selectedCategory = input<string | null>(null);
  categorySelected = output<string | null>();

  onCategoryClick(categoryId: string | null) {
    this.categorySelected.emit(categoryId);
  }
}
