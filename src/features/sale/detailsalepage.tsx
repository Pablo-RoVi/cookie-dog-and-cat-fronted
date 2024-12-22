import React, { useEffect, useState } from 'react';
import Agent from '../../app/api/agent'; // Replace with the actual path to your Agent module
import TableModule from "../../app/components/tablemodule"; // Replace with the actual path to your TableModule
import colors from '../../app/static/colors';
import Buttons from '../../app/components/buttons';
import { useLocation, useNavigate } from 'react-router-dom';

const headersShopping = [
    "Producto",
    "Marca",
    "Categoría",
    "Especie",
    "Precio Unitario",
    "Cantidad",
];

const DetailSalePage = () => {

    const [saleId, setSaleId] = useState<number>(0);
    const [saleNickName, setSaleNickName] = useState<string>("");
    const [saleUserFullName, setSaleUserFullName] = useState<string>("");
    const [salePaymentMethod, setSalePaymentMethod] = useState<string>("");
    const [saleProducts, setSaleProducts] = useState([]);
    const [saleTotalPrice, setSaleTotalPrice] = useState<number>(0);

    const [products, setProducts] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();
    const sale = location.state;

    useEffect(() => {
        const initializeData = async () => {
        try {
            setSaleId(sale.saleId);
            setSaleNickName(sale.nickName);
            setSaleUserFullName(sale.userFullName);
            setSalePaymentMethod(sale.paymentMethod);
            setSaleProducts(sale.saleProducts);
            setSaleTotalPrice(sale.totalPrice);

            const responseProducts = await Agent.Product.list();

            const products = responseProducts.data.map((product) => ({
            value: product.unique_id,
            label: product.product_name,
            }));
            setProducts(products);
        } catch (error) {
            console.error("Error cargando datos iniciales:", error);
        }
        };

        initializeData();
    }, [sale]);

    const getProductLabel = (id: number) => {
        const foundProduct = products.find((p) => p.value === id.toString());
        return foundProduct ? foundProduct.label : "Producto no encontrado";
    };


    return (
        <div className="max-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Título */}
        {TableModule.title({ title: "Detalles de venta" })}

        {/* Formulario */}
        <div className="flex space-x-4">
          <div className="container max-w-[20%]">
            {TableModule.inputFilter({
              label: "Código",
              valueFilter: saleId,
              isDisabled: true,
            })}
          </div>

          <div className="container max-w-[20%]">
            {TableModule.inputFilter({
              label: "Empleado",
              valueFilter: saleUserFullName,
              isDisabled: true,
            })}
          </div>

          <div className="container max-w-[20%]">
            {TableModule.inputFilter({
              label: "Método de pago",
              valueFilter: salePaymentMethod,
              isDisabled: true,
            })}
          </div>
        </div>

        {/* Tabla y botón del carrito */}
        <div className="relative">
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-xl font-semibold"
              style={{
                color: colors.turquoise,
              }}
            >
              Producto(s)
            </h2>
          </div>

          {TableModule.table({
            headers: headersShopping,
            data: saleProducts.map((product) => [
              getProductLabel(product.productId),
              product.productBrand,
              product.productCategory,
              product.productSpecie,
              `$${product.totalPricePerProduct.toLocaleString()}`,
              product.quantity,
            ]),
          })}
        </div>

        {/* Total y botones */}
        <div className="mt-8">
          <div className="text-right mb-4">
            <span
              className="text-xl font-semibold"
              style={{
                color: colors.turquoise,
              }}
            >
              Total producto(s):{" "}
              <span className="text-black">
                ${saleTotalPrice.toLocaleString()}
              </span>
            </span>
          </div>
          <div className="flex justify-end space-x-4">
            <Buttons.FuchsiaButton
              text="Cancelar"
              onClick={() => navigate("/sales")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailSalePage;
