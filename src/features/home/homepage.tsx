import React, { useState } from "react";
import Navbar from "../../app/components/navbar";
import "../../app/static/styles/index.css";

const HomePage = () => {
  const [searchName, setSearchName] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [accountStatusFilter, setAccountStatusFilter] = useState("");

  const employees = [
    { id: 1, rut: "17.132.083-6", firstName: "Camila", lastName: "Tessini", role: "Administrador", username: "ctessini" },
    { id: 2, rut: "22.587.556-1", firstName: "Arazeli", lastName: "Segura", role: "Administrador", username: "asegura" },
    { id: 3, rut: "18.311.728-9", firstName: "Camila", lastName: "Flores", role: "Empleado", username: "cflores" },
    { id: 4, rut: "27.00.1768-1", firstName: "Tatiana", lastName: "Martínez", role: "Empleado", username: "tmartinez" },
    { id: 5, rut: "19.710.989-0", firstName: "Sol", lastName: "Araya", role: "Empleado", username: "saraya" },
    { id: 6, rut: "20.993.070-6", firstName: "Melissa", lastName: "Ramos", role: "Empleado", username: "mramos" },
    { id: 7, rut: "20.410.964-8", firstName: "Amanda", lastName: "Peña", role: "Empleado", username: "apena" },
    { id: 8, rut: "20.504.683-6", firstName: "Ignacia", lastName: "Hidalgo", role: "Empleado", username: "ihidalgo" },
  ];

  const filteredEmployees = employees.filter((employee) => {
    return (
      employee.firstName.toLowerCase().includes(searchName.toLowerCase()) &&
      (roleFilter === "" || employee.role === roleFilter) &&
      (accountStatusFilter === "" || accountStatusFilter === "Activo") // Puedes personalizar esto
    );
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Empleados</h1>

        {/* Filtros */}
        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            placeholder="Nombre"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm w-1/3"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm w-1/3"
          >
            <option value="">Rol</option>
            <option value="Administrador">Administrador</option>
            <option value="Empleado">Empleado</option>
          </select>
          <select
            value={accountStatusFilter}
            onChange={(e) => setAccountStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm w-1/3"
          >
            <option value="">Estado de cuenta</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        {/* Tabla */}
        <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-pink-500 text-white">
              <th className="px-4 py-2">Código</th>
              <th className="px-4 py-2">RUT</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Apellido</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2">Nombre de Usuario</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="border-b">
                <td className="px-4 py-2 text-center">{employee.id}</td>
                <td className="px-4 py-2 text-center">{employee.rut}</td>
                <td className="px-4 py-2 text-center">{employee.firstName}</td>
                <td className="px-4 py-2 text-center">{employee.lastName}</td>
                <td className="px-4 py-2 text-center">{employee.role}</td>
                <td className="px-4 py-2 text-center">{employee.username}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-blue-500 hover:underline mr-2">✏️</button>
                  <button className="text-green-500 hover:underline">✔️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botón añadir */}
        <div className="mt-4">
          <button className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600">
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
