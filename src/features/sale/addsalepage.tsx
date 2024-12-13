import React, { useState } from "react";
import "../../app/static/styles/index.css";
import TableModule from "../../app/components/tablemodule";



const AddSalesPage = () => {
  
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
  );
};

export default AddSalesPage;
