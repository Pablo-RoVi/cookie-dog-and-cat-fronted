import React, { useEffect, useState } from "react";
import "../../app/static/styles/index.css";
import TableModule from "../../app/components/tablemodule";
import TableModal from "../../app/components/tablemodal";
import { useAuth } from "../../app/context/authcontext";
import Buttons from "../../app/components/buttons";
import Agent from "../../app/api/agent";
import colors from "../../app/static/colors";
import { Product, SelectedProduct } from "../../app/models/product";

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
]

const AddSalesPage = () => {
  const [products, setProducts] = useState([]);

  const [availableProducts, setAvailableProducts] = useState([]);

  const { userNickName, userRoleId } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>(userNickName);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [total, setTotal] = useState(
    products.reduce((acc, product) => acc + product.price * product.quantity, 0)
  );
  const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const initializeData = async () => {
      try {
        const usersResponse = await Agent.User.list();
        const filteredEmployees = usersResponse.data.map((user) => ({
          value: user.id,
          label: user.nick_name,
        }));
        setEmployees(filteredEmployees);

        const productsResponse = await Agent.Product.available();
        setAvailableProducts(productsResponse.data);
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const response = await Agent.Sale.getPaymentMethods();
        const filteredSales = response.data.map((sale) => ({
          value: sale,
          label: sale,
        }));
        setPaymentMethodOptions(filteredSales);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    Agent.Sale.getPaymentMethods().then((response) => {
        setPaymentMethod(response.data.map((paymentMethod) => ({
            value: paymentMethod,
            label: paymentMethod
        })));
    })
  },[]);

  const handleQuantityChange = (id, change) => {
    const updatedProducts = products.map((product : SelectedProduct) => {
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
    const updatedProducts = products.filter((product : SelectedProduct) => product.unique_id !== id);
    setProducts(updatedProducts);
    updateTotal(updatedProducts);
  };

  const updateTotal = (updatedProducts) => {
    const newTotal = updatedProducts.reduce(
      (acc, product : SelectedProduct) => acc + parseInt(product.price) * product.quantity,
      0
    );
    setTotal(newTotal);
  };

  const handleAddProducts = () => {
    const updatedProducts = [
      ...products,
      ...selectedProducts.map((product : SelectedProduct) => ({ ...product, quantity: 1 })),
    ];
    setProducts(updatedProducts);
    setSelectedProducts([]);
    setModalOpen(false);
    updateTotal(updatedProducts);
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
              label: "Empleado",
              valueFilter: selectedEmployee,
              setOnChangeFilter: setSelectedEmployee,
              options: employees,
              isDisabled: userRoleId !== 1,
              firstValue: "SIN ELECCIÓN",
            })}
          </div>

          <div className="container max-w-[20%]">
            {TableModule.selectFilter({
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
              onClick={() => setModalOpen(true)}
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
            data: products.map((product : SelectedProduct) => [
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
            onChange={(e) => setSearchTerm(e.target.value)}
            headers={headersProducts}
            data={availableProducts
              .map((product : Product) => [
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
                    } else {
                      setSelectedProducts(
                        selectedProducts.filter((p) => p.id !== product.unique_id)
                      );
                    }
                  }}
                  className="h-5 w-5"
                />,
              ])}
            activateConfirm={true}
            confirmation="Añadir"
            confirmAction={() => handleAddProducts()}
            activateCancel={true}
            confirmCancel={() => setModalOpen(false)}
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
            <Buttons.TurquoiseButton
              text="Añadir"
              onClick={() => null}
            />
            <Buttons.FuchsiaButton
              text="Cancelar"
              onClick={() => null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSalesPage;
