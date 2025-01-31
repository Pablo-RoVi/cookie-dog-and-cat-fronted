import React, { useEffect, useState } from "react";
import "../../app/static/styles/index.css";
import TableModule from "../../app/components/tablemodule";
import TableModal from "../../app/components/tablemodal";
import { useAuth } from "../../app/context/authcontext";
import Buttons from "../../app/components/buttons";
import Agent from "../../app/api/agent";
import colors from "../../app/static/colors";
import { Product, SelectedProduct } from "../../app/models/product";
import { Sale } from "../../app/models/sale";
import Modal from "../../app/components/modal";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line
import { isDisabled } from '@testing-library/user-event/dist/utils';

const headersShopping = [
  "Producto",
  "Marca",
  "Categoría",
  "Especie",
  "Precio Unitario",
  "Cantidad",
  "Acciones",
];

const headersProducts = [
  "Nombre",
  "Marca",
  "Categoría",
  "Especie",
  "Precio",
  "Elegir",
];

const AddSalesPage = () => {
  const { userNickName, userRoleId } = useAuth();

  const [products, setProducts] = useState([]);

  const [availableProducts, setAvailableProducts] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [total, setTotal] = useState(
    products.reduce((acc, product) => acc + product.price * product.quantity, 0)
  );
  const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [isSaleCompleted, setIsSaleCompleted] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const initializeData = async () => {
      try {
        const usersResponse = await Agent.User.list();
        const filteredEmployees = usersResponse.data.map((user) => ({
          value: user.nick_name,
          label: user.nick_name,
          isActive: user.is_active,
        }));
        setEmployees(filteredEmployees.filter((user) => user.isActive));

        setSelectedEmployee(userNickName);

        const productsResponse = await Agent.Product.available();
        setAvailableProducts(productsResponse.data);
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
      }
    };

    initializeData();
  }, [userNickName]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const response = await Agent.Sale.getPaymentMethods();
        const paymentMethods = response.data.map((paymentMethod) => ({
          value: paymentMethod,
          label: paymentMethod,
        }));
        setPaymentMethodOptions(paymentMethods);
      } catch (error) {
        console.error("Error cargando métodos de pago:", error);
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
        if (newQuantity < 1 || newQuantity > product.stock) return product;
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

  const handleAddProducts = () => {
    if (
      products.find((product: SelectedProduct) =>
        selectedProducts.find((p) => p.unique_id === product.unique_id)
      )
    ) {
      const updatedProducts = products.map((product: SelectedProduct) => {
        if (selectedProducts.find((p) => p.unique_id === product.unique_id)) {
          const newQuantity = product.quantity + 1;
          return { ...product, quantity: newQuantity };
        }
        return product;
      });
      setProducts(updatedProducts);
      setSelectedProducts([]);
      setModalOpen(false);
      updateTotal(updatedProducts);
      return;
    }

    const updatedProducts = [
      ...products,
      ...selectedProducts.map((product: SelectedProduct) => ({
        ...product,
        quantity: 1,
      })),
    ];
    console.log("Updated products", updatedProducts);
    setProducts(updatedProducts);
    setSelectedProducts([]);
    setModalOpen(false);
    updateTotal(updatedProducts);
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

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const filtreredAvailableProducts = availableProducts.filter((product) => {
    return product.product_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const addSale = () => {
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
          productId: product.unique_id,
          productBrand: product.brandName,
          productCategory: product.categoryName,
          productSpecie: product.specieName,
          totalPricePerProduct: parseInt(product.price) * product.quantity,
          quantity: product.quantity,
        })),
      ],
    };

    Agent.Sale.add(sale)
      .then((response) => {
        if (response.status === 204) {
          toggleSuccessModal();
        }
      })
      .catch((error) => {
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

  const handleNavigate = () => {
    navigate("/sales");
  };

  const restartForm = async () => {
    const productsResponse = await Agent.Product.available();
    setAvailableProducts(productsResponse.data);
    setPaymentMethod("SIN ELECCIÓN");
    setProducts([]);
    setTotal(0);
    setModalOpen(false);
  };

  return (
    <div className="max-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Título */}
        {TableModule.title({ title: "Registrar nueva venta" })}

        {/* Formulario */}
        <div className="flex space-x-4">
          <div className="container max-w-[20%]">
            {TableModule.selectFilter({
              id: "userName",
              label: "Nombre de usuario",
              valueFilter: selectedEmployee,
              setOnChangeFilter: setSelectedEmployee,
              options: employees,
              firstValue: selectedEmployee,
              isDisabled: userRoleId === 2,
            })}
          </div>

          <div className="container max-w-[20%]">
            {TableModule.selectFilter({
              id: "paymentMethod",
              label: "Método de pago",
              valueFilter: paymentMethod,
              setOnChangeFilter: setPaymentMethod,
              options: paymentMethodOptions,
              firstValue: "SIN ELECCIÓN",
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
            </h2>{" "}
            {/* Color ajustado */}
            <button
              onClick={() => toggleModal()}
              className="p-3 rounded-full shadow-md transition"
              style={{
                backgroundColor: colors.turquoise,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="white"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2m0 0h13.2l1.4-4H5.4L4.6 5zm0 0L6 16.5h12.5M7 20a1.5 1.5 0 11-3 0m15.5-4h-13M17 20a1.5 1.5 0 11-3 0"
                />
              </svg>
            </button>
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

        {/* Modal */}
        {modalOpen && (
          <TableModal
            title="Añadir producto"
            valueFilter={searchTerm}
            setOnChangeFilter={setSearchTerm}
            headers={headersProducts}
            data={filtreredAvailableProducts.filter(
              (p) => !products.some((product) => product.unique_id === p.unique_id)
            ).map((product: Product) => [
              product.product_name,
              product.brandName,
              product.categoryName,
              product.specieName,
              `${product.price}`,
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedProducts([...selectedProducts, product]);
                  } else if (e.target.checked === false) {
                    setSelectedProducts(
                      selectedProducts.filter(
                        (p) => p.unique_id !== product.unique_id
                      )
                    );
                  }
                }}
                className="h-5 w-5"
              />,
            ])}
            activateConfirm={selectedProducts.length > 0}
            disableButton={selectedProducts.length < 1}
            disableInput = {availableProducts.length === 0}
            confirmation="Añadir"
            confirmAction={() => {
              handleAddProducts();
              toggleModal();
              setSearchTerm("");
            }}
            activateCancel={true}
            confirmCancel={() => {
              toggleModal();
              setSelectedProducts([]);
              setSearchTerm("");
            }}
          />
        )}

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
              restartForm();
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
              <Buttons.GrayButton text="Añadir" onClick={() => null} />
            )}
            <Buttons.FuchsiaButton
              text="Cancelar"
              onClick={() => handleNavigate()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSalesPage;
