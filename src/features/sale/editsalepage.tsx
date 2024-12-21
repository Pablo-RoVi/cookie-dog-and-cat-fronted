import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TableModule from "../../app/components/tablemodule";
import Buttons from "../../app/components/buttons";
import Agent from "../../app/api/agent";
import colors from "../../app/static/colors";
import { Product, SelectedProduct } from "../../app/models/product";
import { User } from "../../app/models/user";
import { Sale } from "../../app/models/sale";
import Modal from "../../app/components/modal";
import Functions from "../../app/components/functions";

const headersShopping = [
  "Producto",
  "Marca",
  "Categoría",
  "Especie",
  "Precio Unitario",
  "Cantidad",
];

const AddSalesPage = () => {
    const [saleId, setSaleId] = useState<number>(0);
    const [saleNickName, setSaleNickName] = useState<string>("");
    const [saleUserFullName, setSaleUserFullName] = useState<string>("");
    const [salePaymentMethod, setSalePaymentMethod] = useState<string>("");
    const [saleProducts, setSaleProducts] = useState<Product[]>([]);
    const [saleTotalPrice, setSaleTotalPrice] = useState<number>(0);
    const [saleTotalQuantity, setSaleTotalQuantity] = useState<number>(0);

  const [products, setProducts] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [total, setTotal] = useState(
    products.reduce((acc, product) => acc + product.price * product.quantity, 0)
  );
  const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [isSaleCompleted, setIsSaleCompleted] = useState<boolean>(false);

  const [originalData, setOriginalData] = useState<any>(null);
  
    const location = useLocation();
    const navigate = useNavigate();
    const sale = location.state;

  useEffect(() => {
    const initializeData = async () => {
      try {
        const responseDetail = await Agent.Sale.getDetail(sale.id);
        const saleData = responseDetail.data;
        setOriginalData(saleData);
        setSaleId(saleData.saleId);
        setSaleNickName(saleData.nickName);
        setSaleUserFullName(saleData.userFullName);
        setSalePaymentMethod(saleData.paymentMethod);
        setSaleProducts(saleData.saleProducts);
        setSaleTotalPrice(saleData.totalPrice);
        setSaleTotalQuantity(saleData.totalQuantity);
        
        const responsePaymentMethods = await Agent.Sale.getPaymentMethods();
        const paymentMethods = responsePaymentMethods.data.map((paymentMethod) => ({
          value: paymentMethod,
          label: paymentMethod,
        }));
        setPaymentMethodOptions(paymentMethods);

        console.log("Datos de venta:", saleData);
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (
      selectedEmployee !== "SIN ELECCIÓN" &&
      paymentMethod !== "SIN ELECCIÓN" &&
      products.length > 0 &&
      selectedEmployee !== "" &&
      paymentMethod !== ""
    ) {
      setIsSaleCompleted(true);
    } else {
      setIsSaleCompleted(false);
    }
  }, [selectedEmployee, paymentMethod, products]);

  const handleQuantityChange = (id, change) => {
    const updatedProducts = products.map((product: SelectedProduct) => {
      if (product.unique_id === id) {
        const newQuantity = product.quantity + change;
        if (newQuantity < 1) return product;
        return { ...product, quantity: newQuantity };
      }
      return product;
    });
    setProducts(updatedProducts);
    updateTotal(updatedProducts);
  };

  const handleRemoveProduct = (id) => {
    const updatedProducts = products.filter(
      (product: SelectedProduct) => product.unique_id !== id
    );
    setProducts(updatedProducts);
    updateTotal(updatedProducts);
  };

  const updateTotal = (updatedProducts) => {
    const newTotal = updatedProducts.reduce(
      (acc, product: SelectedProduct) =>
        acc + parseInt(product.price) * product.quantity,
      0
    );
    setTotal(newTotal);
  };

  const toggleSuccessModal = () => {
    setIsSuccessModalOpen(!isSuccessModalOpen);
  };

  const toggleErrorModal = () => {
    setIsErrorModalOpen(!isErrorModalOpen);
  };

  const toggleConfirmModal = () => {
    setIsConfirmModalOpen(!isConfirmModalOpen);
  };

  const addSale = () => {
    console.log(total);

    const sale: Sale = {
      id: null,
      nickName: selectedEmployee,
      totalQuantity: products.reduce(
        (acc, product) => acc + product.quantity,
        0
      ),
      paymentMethod: paymentMethod,
      totalPrice: total,
      saleProducts: [
        ...products.map((product: SelectedProduct) => ({
          productId: parseInt(product.unique_id),
          productBrand: product.brandName,
          productCategory: product.categoryName,
          productSpecie: product.specieName,
          totalPricePerProduct: parseInt(product.price) * product.quantity,
          quantity: product.quantity,
        })),
      ],
    };

    console.log("Venta a añadir:", sale);

    Agent.Sale.add(sale)
      .then((response) => {
        console.log("Venta añadida:", response);
        if (response.status === 200) {
          toggleSuccessModal();
        }
      })
      .catch((error) => {
        console.log("error", error.response);
        let errorMessages = [];
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const errors = error.response.data.errors;

          for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
              if (Array.isArray(errors[key])) {
                errors[key].forEach((msg) => {
                  errorMessages.push(`${key}: ${msg}`);
                });
              } else {
                errorMessages.push(`${key}: ${errors[key]}`);
              }
            }
          }
        } else {
          errorMessages.push(error.response.data);
        }
        setErrorMessage(errorMessages.join("\n"));
        toggleErrorModal();
      });
  };

  return (
    <div className="max-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Título */}
        {TableModule.title({ title: "Editar venta" })}

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
            {TableModule.selectFilter({
              label: "Empleado",
              valueFilter: selectedEmployee,
              setOnChangeFilter: setSelectedEmployee,
              options: employees,
              firstValue: saleUserFullName,
            })}
          </div>

          <div className="container max-w-[20%]">
            {TableModule.selectFilter({
              label: "Método de pago",
              valueFilter: paymentMethod,
              setOnChangeFilter: setPaymentMethod,
              options: paymentMethodOptions,
              firstValue: salePaymentMethod,
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
            data: products.map((product: SelectedProduct) => [
              product.product_name,
              product.brandName,
              product.categoryName,
              product.specieName,
              `$${product.price.toLocaleString()}`,
              product.quantity,
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(product.unique_id, -1)}
                  className="bg-gray-200 text-black font-bold px-2 py-1 rounded-md shadow hover:bg-gray-300"
                >
                  −
                </button>
                <button
                  onClick={() => handleQuantityChange(product.unique_id, 1)}
                  className="bg-gray-200 text-black font-bold px-2 py-1 rounded-md shadow hover:bg-gray-300"
                >
                  +
                </button>
                <button
                  onClick={() => handleRemoveProduct(product.unique_id)}
                  className="bg-gray-200 text-black font-bold px-2 py-1 rounded-md shadow hover:bg-gray-300"
                >
                  ✖
                </button>
              </div>,
            ]),
          })}
        </div>

        {/* Modales de  confirmación, éxito y error*/}

        {isConfirmModalOpen && (
          <Modal
            title="¿Estás seguro de añadir la venta?"
            activateConfirm={true}
            confirmation="Confirmar"
            confirmAction={() => {
              addSale();
              toggleConfirmModal();
            }}
            activateCancel={true}
            confirmCancel={() => toggleConfirmModal()}
          />
        )}

        {isSuccessModalOpen && (
          <Modal
            title="Venta añadida con éxito"
            activateConfirm={true}
            confirmation="Aceptar"
            confirmAction={() => {
              toggleSuccessModal();
              Functions.refreshPage();
            }}
          />
        )}

        {isErrorModalOpen && (
          <Modal
            title={`Corrija los siguientes errores: ${errorMessage}`}
            activateConfirm={true}
            confirmation="Aceptar"
            confirmAction={() => toggleErrorModal()}
          />
        )}

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
              <span className="text-black">${total.toLocaleString()}</span>
            </span>
          </div>
          <div className="flex justify-end space-x-4">
            {isSaleCompleted ? (
              <Buttons.TurquoiseButton
                text="Añadir"
                onClick={() => toggleConfirmModal()}
              />
            ) : (
              <Buttons.GrayButton text="Editar" onClick={() => null} />
            )}
            <Buttons.FuchsiaButton text="Cancelar" onClick={() => navigate("/sales")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSalesPage;
