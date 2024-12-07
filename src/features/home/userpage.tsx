import React, { useState, useEffect } from "react";
import Navbar from "../../app/components/navbar";
import "../../app/static/styles/index.css";
import Agent from "../../app/api/agent";
import colors from "../../app/static/colors";
import buttons from "../../app/components/buttons";
import TableModule from "../../app/components/tablemodule";
import { User } from "../../app/models/user";

const headers = ["Código", "RUT", "Nombre", "Apellido", "Rol", "Nombre de Usuario", "Acciones"];

const UserPage = () => {

  const [searchName, setSearchName] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [accountStatusFilter, setAccountStatusFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

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

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold" style={{color: colors.turquoise}}>Empleados</h1>

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
            <option value="Admin">Administrador</option>
            <option value="Employee">Empleado</option>
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
        {TableModule.table({headers: headers, data: currentUsers.map((user: User) => [
          user.id,
          user.rut,
          user.name,
          user.last_name,
          user.role.role_name,
          user.nick_name,
          <>
            {buttons.turquoiseButton({ text: "Editar" })}
            {buttons.fuchsiaButton({ text: "Eliminar" })}
          </>
        ])})}

        {/* Paginación */}
        {TableModule.pagination({
          length: filteredUsers.length, 
          perPage: usersPerPage, 
          currentPage: currentPage, 
          paginate: paginate
        })}
        
        {/* Botón Agregar */}
        <div className="flex justify-center mt-4">
          {buttons.turquoiseButton({ text: "Añadir" })}
        </div>
      </div>
    </div>
  );

};

export default UserPage;