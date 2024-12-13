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
    {
      id: 3,
      name: "Churu de Pollo",
      brand: "Purina!",
      category: "Alimento",
      species: "Gato",
      price: 50000,
      quantity: 10,
    },
  ]);

  const [employees] = useState([
    { id: 1, name: "Camila Tessini" },
    { id: 2, name: "Carlos Martínez" },
    { id: 3, name: "Ana López" },
    { id: 4, name: "Javier Fernández" },
  ]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [total, setTotal] = useState(
    products.reduce((acc, product) => acc + product.price * product.quantity, 0)
  );

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

  return (
    <div className="max-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Título */}
        <h1 className="text-4xl font-bold text-[#6FC9D1] mb-6">
          Registrar nueva venta
        </h1>

        {/* Formulario */}
        <div className="flex space-x-4 mb-6">
          {/* Código */}
          <div className="container max-w-[20%]">
            <label className="block font-semibold text-[#6FC9D1] mb-2">Código</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              disabled
              value="9"
            />
          </div>

          {/* Empleado */}
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

          {/* Método de pago */}
          <div className="container max-w-[20%]">
            <label className="block font-semibold text-[#6FC9D1] mb-2">Método de pago</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
            >
              <option value="" disabled hidden>
                {/* Campo vacío */}
              </option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Débito</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        {TableModule.table({
          headers: headers,
          data: products.map((product) => [
            product.name,
            product.brand,
            product.category,
            product.species,
            `$${product.price.toLocaleString()}`,
            product.quantity,
            <>
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
              </div>
            </>,
          ]),
        })}

        {/* Total y botones */}
        <div className="mt-8">
          <div className="text-right mb-4">
            <span className="text-xl font-semibold text-[#6FC9D1]">
              Total producto(s):{" "}
              <span className="text-black">${total.toLocaleString()}</span>
            </span>
          </div>
          <div className="flex justify-end space-x-4">
            {/* Botón Añadir */}
            <button
              onClick={() => console.log("Venta añadida")}
              className="bg-[#6FC9D1] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#5ab5c2]"
            >
              Añadir
            </button>
            {/* Botón Cancelar */}
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
