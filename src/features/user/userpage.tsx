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
import { useAuth } from "../../app/context/authcontext";

const adminHeaders = [
  "Código",
  "RUT",
  "Nombre",
  "Apellido",
  "Rol",
  "Nombre de Usuario",
  "Acciones",
];

const employeeHeaders = [
  "Código",
  "RUT",
  "Nombre",
  "Apellido",
  "Rol",
  "Nombre de Usuario",
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

  const { userRoleId } = useAuth();

  useEffect(() => {
    const initializeData = async () => {
      try {
        const response = await Agent.User.list();
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
    // Filtro por nombre
    const matchesName = user.name.toLowerCase().includes(searchName.toLowerCase());
  
    // Filtro por rol
    const matchesRole =
      roleFilter === "SIN ELECCIÓN" || roleFilter === "" || user.role.role_name === roleFilter;
  
    // Filtro por estado de cuenta
    const matchesAccountStatus =
      accountStatusFilter === "SIN ELECCIÓN" ||
      accountStatusFilter === "" ||
      (accountStatusFilter === "Activo" && user.is_active) ||
      (accountStatusFilter === "Inactivo" && !user.is_active);
  
    // Devolver true si todos los filtros coinciden
    return matchesName && matchesRole && matchesAccountStatus;
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
      Agent.User.changeState(id)
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
              firstValue: "SIN ELECCIÓN",
            })}
          </div>
          <div className="container max-w-[20%]">
            {TableModule.selectFilter({
              label: "Estado de la Cuenta",
              valueFilter: accountStatusFilter,
              setOnChangeFilter: setAccountStatusFilter,
              options: options.accountStatusOptions,
              firstValue: "SIN ELECCIÓN",
            })}
          </div>
        </div>

        {/* Tabla */}
        {TableModule.table({
          headers: userRoleId === 1 ? adminHeaders : employeeHeaders,
          data: currentUsers.map((user: User) => {
            const rows : (string | JSX.Element)[] = [
            user.id,
            user.rut,
            user.name,
            user.last_name,
            Functions.translateRole(user.role.role_name),
            user.nick_name
            ];
            if(userRoleId === 1) {
              rows.push(
              <>
                <div className="flex justify-center items-center ml-4 mr-4 gap-x-16">
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
              </>
              );
            }
            return rows;
          }),
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
        {userRoleId === 1 ?
          <Buttons.TurquoiseButton
          text="Añadir"
          onClick={() => handleNavigate("/add-user")}
          />
          :
          <Buttons.GrayButton
          text="Añadir"
          onClick={() => null}
          />
        }
      </div>
    </div>
  );
};

export default UserPage;
