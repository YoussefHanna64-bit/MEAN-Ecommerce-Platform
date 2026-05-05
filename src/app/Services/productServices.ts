import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Product, ProductResponse } from '../models/productModel';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = 'http://localhost:5000/api/products';
  private http = inject(HttpClient);
  getProducts() {
    return this.http.get<ProductResponse>(`${this.baseUrl}/`);
  }
  getProduct(id: string) {
    return this.http.get<ProductResponse>(`${this.baseUrl}/${id}`);
  }
  addProduct(product: Product) {
    return this.http.post<Product>(`${this.baseUrl}/`, product);
  }
  deleteProduct(id: string) {
    return this.http.delete<Product>(`${this.baseUrl}/${id}`);
  }
  updateProduct(id: string, product: Product) {
    return this.http.patch<Product>(`${this.baseUrl}/${id}`, product);
  }

}
