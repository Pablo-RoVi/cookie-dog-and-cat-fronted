import React, { useEffect, useState } from "react";
import "../../app/static/styles/index.css";
import TableModule from "../../app/components/tablemodule";
import { useAuth } from "../../app/context/authcontext";
import Options from "../../app/components/options";
import Buttons from "../../app/components/buttons";
import Agent from "../../app/api/agent";
import colors from "../../app/static/colors";

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
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Cachitos",
      brand: "Cookie Dog + Cat",
      category: "Comida Natural",
      species: "Perro",
      price: 2000,
      quantity: 1,
    },
  ]);

  const [availableProducts] = useState([
    {
      id: 2,
      name: "Cepillo de pelo",
      brand: "KONG",
      category: "Higiene",
      species: "Perro",
      price: 7000,
    },
    {
      id: 3,
      name: "Collar",
      brand: "Royal Canin",
      category: "Paseo",
      species: "Perro",
      price: 8000,
    },
    {
      id: 4,
      name: "Bozal XL",
      brand: "PetSafe",
      category: "Paseo",
      species: "Perro",
      price: 12000,
    },
  ]);

  const { userNickName, userRoleId } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] =
    useState<string>(userNickName);
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
        const response = await Agent.Users.list();
        const filteredEmployees = response.data.map((user) => ({
          value: user.id,
          label: user.nick_name,
        }));
        setEmployees(filteredEmployees);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const response = await Agent.Sales.getPaymentMethods();
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

  const handleQuantityChange = (id, change) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
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
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    updateTotal(updatedProducts);
  };

  const updateTotal = (updatedProducts) => {
    const newTotal = updatedProducts.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    setTotal(newTotal);
  };

  const handleAddProducts = () => {
    const updatedProducts = [
      ...products,
      ...selectedProducts.map((product) => ({ ...product, quantity: 1 })),
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
              firstValue: userNickName,
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
            data: products.map((product) => [
              product.name,
              product.brand,
              product.category,
              product.species,
              `$${product.price.toLocaleString()}`,
              product.quantity,
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(product.id, -1)}
                  className="bg-gray-200 text-black font-bold px-2 py-1 rounded-md shadow hover:bg-gray-300"
                >
                  −
                </button>
                <button
                  onClick={() => handleQuantityChange(product.id, 1)}
                  className="bg-gray-200 text-black font-bold px-2 py-1 rounded-md shadow hover:bg-gray-300"
                >
                  +
                </button>
                <button
                  onClick={() => handleRemoveProduct(product.id)}
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
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[60%]">
              <h2 className="text-2xl font-bold text-[#6FC9D1] mb-4">
                Añadir producto
              </h2>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar producto por nombre..."
                  className="w-1/2 p-2 border border-gray-300 rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <table className="w-full border-collapse border border-gray-300 text-left">
                <thead className="bg-[#FC67C4] text-white">
                  <tr>
                    <th className="p-3 border border-gray-300">Nombre</th>
                    <th className="p-3 border border-gray-300">Marca</th>
                    <th className="p-3 border border-gray-300">Categoría</th>
                    <th className="p-3 border border-gray-300">Especie</th>
                    <th className="p-3 border border-gray-300">Precio</th>
                    <th className="p-3 border border-gray-300">Elegir</th>
                  </tr>
                </thead>
                <tbody>
                  {availableProducts
                    .filter((product) =>
                      product.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((product) => (
                      <tr key={product.id} className="hover:bg-gray-100">
                        <td className="p-3 border border-gray-300">
                          {product.name}
                        </td>
                        <td className="p-3 border border-gray-300">
                          {product.brand}
                        </td>
                        <td className="p-3 border border-gray-300">
                          {product.category}
                        </td>
                        <td className="p-3 border border-gray-300">
                          {product.species}
                        </td>
                        <td className="p-3 border border-gray-300">
                          ${product.price.toLocaleString()}
                        </td>
                        <td className="p-3 border border-gray-300 text-center">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProducts([
                                  ...selectedProducts,
                                  product,
                                ]);
                              } else {
                                setSelectedProducts(
                                  selectedProducts.filter(
                                    (p) => p.id !== product.id
                                  )
                                );
                              }
                            }}
                            className="h-5 w-5"
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={handleAddProducts}
                  className="bg-[#6FC9D1] text-white px-6 py-2 rounded-md hover:bg-[#5ab5c2] transition"
                >
                  Añadir
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
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
