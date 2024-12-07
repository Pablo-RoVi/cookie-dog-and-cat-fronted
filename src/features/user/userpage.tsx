import React, { useState, useEffect } from "react";
import Navbar from "../../app/components/navbar";
import "../../app/static/styles/index.css";
import Agent from "../../app/api/agent";
import colors from "../../app/static/colors";
import buttons from "../../app/components/buttons";
import TableModule from "../../app/components/tablemodule";
import { User } from "../../app/models/user";

const headers = ["Código", "RUT", "Nombre", "Apellido", "Rol", "Nombre de Usuario", "Acciones"];
const roleOptions = [
  {
    value: "Admin",
    label: "Administrador"
  },
  {
    value: "Employee",
    label: "Empleado"
  }
];
const accountStatusOptions = [
  {
    value: "Activo",
    label: "Activo"
  },
  {
    value: "Inactivo",
    label: "Inactivo"
  }
];

const UserPage = () => {

  const [searchName, setSearchName] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [accountStatusFilter, setAccountStatusFilter] = useState<string>("");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
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

  const translateRole = (role: string) => {
    const roleTranslation = {
      Admin: "Administrador",
      Employee: "Empleado"
    };
    return roleTranslation[role] || role;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4" style={{color: colors.turquoise}}>Empleados</h1>

        {/* Filtros */}
        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            placeholder="Nombre"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm w-1/3"
          />
          {TableModule.selectFilter({
            valueFilter: roleFilter,
            setOnChangeFilter: setRoleFilter,
            placeholder: "Rol",
            options: roleOptions
          })}
          {TableModule.selectFilter({
            valueFilter: accountStatusFilter,
            setOnChangeFilter: setAccountStatusFilter,
            placeholder: "Estado de la Cuenta",
            options: accountStatusOptions
          })}
        </div>

        {/* Tabla */}
        {TableModule.table({headers: headers, data: currentUsers.map((user: User) => [
          user.id,
          user.rut,
          user.name,
          user.last_name,
          translateRole(user.role.role_name),
          user.nick_name,
          <>
            <div className="flex justify-between items-center">
              {buttons.editButton({user})}
              {buttons.setStatusButton({id: user.id, is_active: user.is_active})}
            </div>
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
        {buttons.turquoiseButton({ text: "Añadir" })}
      </div>
    </div>
  );

};

export default UserPage;