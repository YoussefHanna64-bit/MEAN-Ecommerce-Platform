export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  _id?: string;
  name: string;
  description: string;
  discount: number;
  stock: number;
  rating?: Rating;
  category: string | any;
  price: number;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ProductResponse {
  status: string;
  data?: {
    products: Product[];
  };
}
