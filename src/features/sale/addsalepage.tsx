import React, { useState } from "react";
import "../../app/static/styles/index.css";
import TableModule from "../../app/components/tablemodule";

const headers = ["Producto", "Marca", "Categoría", "Especie", "Precio", "Cantidad", "Acciones"];

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
    {
      id: 2,
      name: "Bolsas de paseo",
      brand: "PetSafe",
      category: "Paseo",
      species: "-",
      price: 6000,
      quantity: 3,
    },
  ]);

  const [availableProducts] = useState([
    { id: 3, name: "Cepillo de pelo", brand: "KONG", category: "Higiene", species: "Perro", price: 7000 },
    { id: 4, name: "Collar", brand: "Royal Canin", category: "Paseo", species: "Perro", price: 8000 },
    { id: 5, name: "Bozal XL", brand: "PetSafe", category: "Paseo", species: "Perro", price: 12000 },
  ]);

  const [employees] = useState([
    { id: 1, name: "Camila Tessini" },
    { id: 2, name: "Carlos Martínez" },
    { id: 3, name: "Ana López" },
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [total, setTotal] = useState(
    products.reduce((acc, product) => acc + product.price * product.quantity, 0)
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
        <h1 className="text-4xl font-bold text-[#6FC9D1] mb-6">Registrar nueva venta</h1>

        {/* Formulario */}
        <div className="flex space-x-4 mb-6">
          <div className="container max-w-[20%]">
            <label className="block font-semibold text-[#6FC9D1] mb-2">Código</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              disabled
              value="9"
            />
          </div>

          <div className="container max-w-[20%]">
            <label className="block font-semibold text-[#6FC9D1] mb-2">Empleado</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
            >
              <option value="">Seleccione un empleado</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.name}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          <div className="container max-w-[20%]">
            <label className="block font-semibold text-[#6FC9D1] mb-2">Método de pago</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
            >
              <option value="" disabled hidden></option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Débito</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>
        </div>

        {/* Tabla y botón del carrito */}
        <div className="relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#333333]">Productos</h2>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-[#6FC9D1] p-3 rounded-full shadow-md hover:bg-[#5ab5c2] transition"
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
            headers: headers,
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
              <h2 className="text-2xl font-bold text-[#6FC9D1] mb-4">Añadir producto</h2>

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
                      product.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((product) => (
                      <tr key={product.id} className="hover:bg-gray-100">
                        <td className="p-3 border border-gray-300">{product.name}</td>
                        <td className="p-3 border border-gray-300">{product.brand}</td>
                        <td className="p-3 border border-gray-300">{product.category}</td>
                        <td className="p-3 border border-gray-300">{product.species}</td>
                        <td className="p-3 border border-gray-300">
                          ${product.price.toLocaleString()}
                        </td>
                        <td className="p-3 border border-gray-300 text-center">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProducts([...selectedProducts, product]);
                              } else {
                                setSelectedProducts(
                                  selectedProducts.filter((p) => p.id !== product.id)
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
            <span className="text-xl font-semibold text-[#6FC9D1]">
              Total producto(s): <span className="text-black">${total.toLocaleString()}</span>
            </span>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => console.log("Venta añadida")}
              className="bg-[#6FC9D1] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#5ab5c2]"
            >
              Añadir
            </button>
            <button
              onClick={() => console.log("Venta cancelada")}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-pink-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSalesPage;
