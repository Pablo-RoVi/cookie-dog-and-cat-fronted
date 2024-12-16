import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../app/static/styles/index.css";
import Agent from "../../app/api/agent";
import Buttons from "../../app/components/buttons";
import TableModule from "../../app/components/tablemodule";
import Functions from "../../app/components/functions";
import { User } from "../../app/models/user";
import options from "../../app/components/options";
import Modal from "../../app/components/modal";
import ConfirmAdminLogged from "../../app/components/confirmadmin";

const headers = [
  "Código",
  "RUT",
  "Nombre",
  "Apellido",
  "Rol",
  "Nombre de Usuario",
  "Acciones",
];

const UserPage = () => {
  const [searchName, setSearchName] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [accountStatusFilter, setAccountStatusFilter] = useState<string>("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);
  const [isChangedStateModal, setIsChangedStateModal] =
    useState<boolean>(false);
  const [isConfirmationAdminLogged, setIsConfirmationAdminLogged] =
    useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();
  const usersPerPage = 8;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const response = await Agent.Users.list();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, roleFilter, accountStatusFilter]);

  const deleteText = (selectedUser: User) => {
    const actionText = selectedUser.is_active ? "eliminar" : "restaurar";
    const text = `¿Desear ${actionText} a '${selectedUser.name} ${selectedUser.last_name}' de RUT '${selectedUser.rut}'?`;
    return text;
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchName.toLowerCase()) &&
      (roleFilter === "" || user.role.role_name === roleFilter) &&
      (accountStatusFilter === "" ||
        // eslint-disable-next-line no-mixed-operators
        (accountStatusFilter === "Activo" && user.is_active) ||
        // eslint-disable-next-line no-mixed-operators
        (accountStatusFilter === "Inactivo" && !user.is_active))
    );
  });

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleNavigate = (path: string, state?: any) => {
    navigate(path, state ? { state } : undefined);
  };

  const toggleConfirmationModal = () => {
    setIsConfirmationModalOpen(!isConfirmationModalOpen);
  };

  const toggleChangedStateModal = () => {
    setIsChangedStateModal(!isChangedStateModal);
  };

  const toggleConfirmAdminLogged = () => {
    setIsConfirmationAdminLogged(!isConfirmationAdminLogged);
  };

  const changeStateUser = (id: string) => {
    if (selectedUser) {
      Agent.Users.changeState(id)
        .then(() => {
          toggleConfirmationModal();
          toggleChangedStateModal();
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  return (
    <div className="max-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {TableModule.title({ title: "Empleados" })}
        {/* Filtros */}
        <div className="flex space-x-4">
          <div className="container max-w-[20%]">
            {TableModule.inputFilter({
              label: "Nombre",
              valueFilter: searchName,
              setOnChangeFilter: setSearchName,
            })}
          </div>
          <div className="container max-w-[20%]">
            {TableModule.selectFilter({
              label: "Rol",
              valueFilter: roleFilter,
              setOnChangeFilter: setRoleFilter,
              options: options.roleOptions,
            })}
          </div>
          <div className="container max-w-[20%]">
            {TableModule.selectFilter({
              label: "Estado de la Cuenta",
              valueFilter: accountStatusFilter,
              setOnChangeFilter: setAccountStatusFilter,
              options: options.accountStatusOptions,
            })}
          </div>
        </div>

        {/* Tabla */}
        {TableModule.table({
          headers: headers,
          data: currentUsers.map((user: User) => [
            user.id,
            user.rut,
            user.name,
            user.last_name,
            Functions.translateRole(user.role.role_name),
            user.nick_name,
            <>
              <div className="flex justify-between items-center ml-4 mr-4">
                <Buttons.EditButton
                  onClick={() => handleNavigate("/edit-user", user)}
                />
                {Buttons.SetStatusButton({
                  isActive: user.is_active,
                  onClick: () => {
                    setSelectedUser(user);
                    toggleConfirmationModal();
                  },
                })}
              </div>
            </>,
          ]),
        })}

        {isConfirmationModalOpen &&
          !isConfirmationAdminLogged &&
          selectedUser.role.role_name !== "Admin" && (
            <Modal
              title={deleteText(selectedUser)}
              confirmAction={setIsConfirmationAdminLogged}
              confirmation={selectedUser.is_active ? "Eliminar" : "Restaurar"}
              confirmCancel={toggleConfirmationModal}
              activateCancel={true}
              activateConfirm={true}
            />
          )}

        {isConfirmationAdminLogged && (
          <ConfirmAdminLogged
            confirmation="Confirmar"
            confirmAction={() => {
              changeStateUser(selectedUser.id.toString());
            }}
            confirmCancel={() => {
              toggleConfirmAdminLogged();
              toggleConfirmationModal();
            }}
            activateCancel={true}
            activateConfirm={true}
          />
        )}

        {isConfirmationModalOpen &&
          !isConfirmationAdminLogged &&
          selectedUser.role.role_name === "Admin" && (
            <Modal
              title={`No puedes eliminar a ${selectedUser.name} ${selectedUser.last_name} porque es administrador`}
              confirmation="Aceptar"
              confirmAction={toggleConfirmationModal}
              activateCancel={false}
              activateConfirm={true}
            />
          )}

        {isChangedStateModal && !isConfirmationAdminLogged && (
          <Modal
            title={`Usuario ${
              selectedUser.is_active ? "eliminado" : "restaurado"
            } con éxito`}
            confirmation="Aceptar"
            confirmAction={() => {
              toggleChangedStateModal();
              Functions.refreshPage();
            }}
            activateCancel={false}
            activateConfirm={true}
          />
        )}

        {/* Paginación */}
        {TableModule.pagination({
          length: filteredUsers.length,
          perPage: usersPerPage,
          currentPage: currentPage,
          paginate: paginate,
        })}

        {/* Botón Agregar */}
        <Buttons.TurquoiseButton
          text="Añadir"
          onClick={() => handleNavigate("/add-user")}
        />
      </div>
    </div>
  );
};

export default UserPage;
