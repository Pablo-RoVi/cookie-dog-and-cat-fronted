import React, { useState } from "react";
import "../../app/static/styles/index.css";
import TableModule from "../../app/components/tablemodule";
import Buttons from "../../app/components/buttons";
import { useNavigate } from "react-router-dom";


const headers = ["Código", "Producto(s)", "Precio Total", "Medio de pago", "Trabajador(a)","Acciones"];

const SalePage = () => {
    const navigate = useNavigate();
    
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
    const [sales, setSales] = useState([
      {
        id: 954252,
        Total_quantity: 5,
        Total: 2000,
        Date: "12/12/2022",
        Payment_method: "MasterCard",
        UserId: 1,
        products : products
      },
    ]);
    const [employees] = useState([
        { id: 1, name: "Camila Tessini" },
        { id: 2, name: "Carlos Martínez" },
        { id: 3, name: "Ana López" },
      ]);

  

  
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
  
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
  
  const handleNavigate = (path: string, state?: any) => {
    navigate(path, state ? { state } : undefined);
  };

    return (
      <div className="max-h-screen bg-white">
        <div className="container mx-auto px-4 py-6">
          {/* Título */}
          <h1 className="text-4xl font-bold text-[#6FC9D1] mb-6">Ventas</h1>
  
         
  
          {/* Tabla y botón del carrito */}
          <div className="relative">
            {TableModule.table({
              headers: headers,
              data: sales.map((sale) => [
                sale.id,
                sale.products.map((product) => product.name).join(", "),
                sale.Total,
                sale.Payment_method,
                sale.products.map((product) => product.name).join(", "),
                <div className="flex justify-between items-center ml-4 mr-4">
                  <Buttons.EditButton
                    onClick={() => handleNavigate("/edit-sale")}/>
                  <Buttons.DetailButton
                    onClick={() => }/>
                  <Buttons.DeleteButton
                    onClick={() => }/>
              </div>,
              ]),
            })}
          </div>
  
          {/* Modal */}
          {modalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-[60%]">
                <table className="w-full border-collapse border border-gray-300 text-left">
                  <thead className="bg-[#FC67C4] text-white">
                    <tr>
                      <th className="p-3 border border-gray-300">Nombre</th>
                      <th className="p-3 border border-gray-300">Marca</th>
                      <th className="p-3 border border-gray-300">Categoría</th>
                      <th className="p-3 border border-gray-300">Especie</th>
                      <th className="p-3 border border-gray-300">Elegir</th>
                    </tr>
                  </thead>
                </table>
  
                <div className="flex justify-end space-x-4 mt-4">
                  <button
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
        </div>
      </div>
    );
  };
export default SalePage;