import { Product } from "./product";

export interface Sale {
    nickname: string;
    totalQuantity: number;
    paymentMethod: string;
    totalPrice: number;
    saleProducts: SaleProducts[];
}

export interface SaleProducts {
    productId: number;
    productBrand: string;
    productCategory: string;
    productSpecie: string;
    totalPricePerProduct: number;
    quantity: number;
}