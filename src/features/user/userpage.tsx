import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../../app/static/styles/index.css";
import Agent from "../../app/api/agent";
import colors from "../../app/static/colors";
import Buttons from "../../app/components/buttons";
import Options from "../../app/components/options";
import TableModule from "../../app/components/tablemodule";
import { User } from "../../app/models/user";
import options from "../../app/components/options";

const headers = ["Código", "RUT", "Nombre", "Apellido", "Rol", "Nombre de Usuario", "Acciones"];

const UserPage = () => {

  const [searchName, setSearchName] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [accountStatusFilter, setAccountStatusFilter] = useState<string>("");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();
  const usersPerPage = 8;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    Agent.Users.list().then((response) => {
      setUsers(response);
    });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, roleFilter, accountStatusFilter]);

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

  const handleNavigate = (path: string, state?: any) => {
    navigate(path, state ? { state } : undefined);
  };


  return (
    <div className="max-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {TableModule.title({title: "Empleados"})}
        {/* Filtros */}
        <div className="flex space-x-4 mb-6">
          {TableModule.inputFilter({
            label: "Nombre",
            valueFilter: searchName,
            setOnChangeFilter: setSearchName,
            placeholder: "Nombre"
          })}
          {TableModule.selectFilter({
            label: "Rol",
            valueFilter: roleFilter,
            setOnChangeFilter: setRoleFilter,
            placeholder: "Rol",
            options: options.roleOptions
          })}
          {TableModule.selectFilter({
            label: "Estado de la Cuenta",
            valueFilter: accountStatusFilter,
            setOnChangeFilter: setAccountStatusFilter,
            placeholder: "Estado de la Cuenta",
            options: options.accountStatusOptions
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
              <div className="flex justify-between items-center ml-4 mr-4">
                  <Buttons.EditButton onClick={() => handleNavigate("/edit-user", user)} />
                  {Buttons.SetStatusButton(user)}
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
        <Buttons.TurquoiseButton text="Añadir" onClick={() => handleNavigate("/add-user")} />
      </div>
    </div>
  );

};

export default UserPage;