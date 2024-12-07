import React, { useState, useEffect } from "react";
import Navbar from "../../app/components/navbar";
import "../../app/static/styles/index.css";
import Agent from "../../app/api/agent";

const UserPage = () => {

  const [searchName, setSearchName] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [accountStatusFilter, setAccountStatusFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    Agent.Users.list().then((response) => {
      setUsers(response);
    });
  }, []);

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchName.toLowerCase()) &&
      (roleFilter === "" || user.role.role_name === roleFilter) &&
      (accountStatusFilter === "" || 
        (accountStatusFilter === "Activo" && user.is_active))
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
            {currentUsers.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-4 py-2 text-center">{user.id}</td>
                <td className="px-4 py-2 text-center">{user.rut}</td>
                <td className="px-4 py-2 text-center">{user.name}</td>
                <td className="px-4 py-2 text-center">{user.last_name}</td>
                <td className="px-4 py-2 text-center">{user.role.role_name}</td>
                <td className="px-4 py-2 text-center">{user.nick_name}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-blue-500 hover:underline mr-2">✏️</button>
                  <button className="text-green-500 hover:underline">✔️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(Math.ceil(filteredUsers.length / usersPerPage)).keys()].map(
            (page) => (
              <button
                key={page + 1}
                onClick={() => paginate(page + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === page + 1
                    ? "bg-pink-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {page + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );

};

export default UserPage;