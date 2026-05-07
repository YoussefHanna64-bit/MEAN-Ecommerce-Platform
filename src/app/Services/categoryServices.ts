import { HttpClient } from "@angular/common/http";
import { inject, Inject, Injectable } from "@angular/core";
import { Category, CategoryResponse } from "../models/categoryModel";

@Injectable({
    providedIn: "root",
})
export class CategoryService {
    baseUrl = 'http://localhost:5000/api/category';
  private http = inject(HttpClient);

  getAllCategories() {
    return this.http.get<CategoryResponse>(`${this.baseUrl}/`);
  }
  getCategoryById(id: string) {
    return this.http.get<CategoryResponse>(`${this.baseUrl}/${id}`);
  }
  addCategory(category: Category) {
    return this.http.post<CategoryResponse>(`${this.baseUrl}/`, category);
  }
  updateCategory(id: string, category: Category) {
    return this.http.patch<CategoryResponse>(`${this.baseUrl}/${id}`, category);
  }
  deleteCategory(id: string) {
    return this.http.delete<CategoryResponse>(`${this.baseUrl}/${id}`);
  }

}