import React, { useState } from "react";
import "../../app/static/styles/index.css";

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
</div>
