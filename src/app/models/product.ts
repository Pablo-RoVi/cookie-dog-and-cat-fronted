export interface Product {
  unique_id: string;
  product_name: string;
  stock: string;
  price: string;
  categoryName: string;
  brandName: string;
  specieName: string;
}

export interface SelectedProduct {
  unique_id: string;
  product_name: string;
  stock: string;
  price: string;
  categoryName: string;
  brandName: string;
  specieName: string;
  quantity: number;
}

