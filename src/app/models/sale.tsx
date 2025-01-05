export interface Sale {
    id: number;
    nickName: string;
    totalQuantity: number;
    paymentMethod: string;
    totalPrice: number;
    saleProducts: SaleProducts[];
}

export interface SaleProducts {
    productId: string;
    productBrand: string;
    productCategory: string;
    productSpecie: string;
    totalPricePerProduct: number;
    quantity: number;
}