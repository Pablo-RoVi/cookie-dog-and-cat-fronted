import React, { useEffect, useState } from 'react';
import TableModule from "../../app/components/tablemodule";
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
    const [salePaymentMethod, setSalePaymentMethod] = useState<string>("");
    const [saleProducts, setSaleProducts] = useState([]);
    const [saleTotalPrice, setSaleTotalPrice] = useState<number>(0);

    const location = useLocation();
    const navigate = useNavigate();
    const sale = location.state;

    useEffect(() => {
        const initializeData = async () => {
        try {
            setSaleId(sale.saleId);
            setSaleNickName(sale.nickName);
            setSalePaymentMethod(sale.paymentMethod);
            setSaleProducts(sale.products);
            setSaleTotalPrice(sale.totalPrice);
            
        } catch (error) {
            console.error("Error cargando datos iniciales:", error);
        }
        };

        initializeData();
    }, [sale]);

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
              label: "Nombre de usuario",
              valueFilter: saleNickName,
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
              product.product_name,
              product.brandName,
              product.categoryName,
              product.specieName,
              `$${product.price.toLocaleString()}`,
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
              text="Volver"
              onClick={() => navigate("/sales")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailSalePage;
