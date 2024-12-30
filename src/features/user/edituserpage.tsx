import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Buttons from "../../app/components/buttons";
import Options from "../../app/components/options";
import cookie from "../../app/static/images/cookie.png";
import TableModule from "../../app/components/tablemodule";
import Functions from "../../app/components/functions";
import Modal from "../../app/components/modal";
import ConfirmAdminLogged from "../../app/components/confirmadmin";
import Agent from "../../app/api/agent";
import { AxiosResponse } from "axios";

const EditUserPage = () => {
  const [id, setId] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [rut, setRut] = useState<string>("");
  const [nickName, setNickName] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [isConfirmationUserModalOpen, setIsConfirmationUserModalOpen] =
    useState<boolean>(false);
  const [isChangedUserModal, setIsChangedUserModal] = useState<boolean>(false);
  const [isConfirmationPasswordModalOpen, setIsConfirmationPasswordModalOpen] =
    useState<boolean>(false);
  const [isChangedPasswordModal, setIsChangedPasswordModal] =
    useState<boolean>(false);
  const [isConfirmationAdminLogged, setIsConfirmationAdminLogged] =
    useState<boolean>(false);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [originalData, setOriginalData] = useState<any>(null);
  const [isUserModified, setIsUserModified] = useState<boolean>(false);
  const [isPasswordModified, setIsPasswordModified] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state;

  const confirmText = isConfirmationUserModalOpen
    ? "¿Desea editar al usuario?"
    : "¿Desea editar la contraseña?";
  const changedText = isChangedUserModal
    ? "Usuario editado con éxito"
    : "Contraseña editada con éxito";

  useEffect(() => {
    if (user) {
      const userData = {
        id: user.id,
        name: user.name,
        lastName: user.last_name,
        rut: user.rut,
        nickName: user.nick_name,
        role: user.role.role_name,
      };
      setOriginalData(userData);
      setId(user.id);
      setName(user.name);
      setLastName(user.last_name);
      setRut(user.rut);
      setNickName(user.nick_name);
      setRole(user.role.role_name);
    }
  }, [user]);

  useEffect(() => {
    if (originalData) {
      setIsUserModified(
        name !== originalData.name ||
          lastName !== originalData.lastName ||
          (role !== originalData.role && role !== "")
      );
    }
  }, [name, lastName, role, originalData]);

  useEffect(() => {
    setIsPasswordModified(
      Functions.verifyPasswords(newPassword, confirmNewPassword)
    );
  }, [newPassword, confirmNewPassword]);

  const handleNavigate = () => {
    navigate("/users");
  };

  const toggleConfirmationUserModal = () => {
    setIsConfirmationUserModalOpen(!isConfirmationUserModalOpen);
  };

  const toggleChangedUserModal = () => {
    setIsChangedUserModal(!isChangedUserModal);
  };

  const toggleConfirmationPasswordModal = () => {
    setIsConfirmationPasswordModalOpen(!isConfirmationPasswordModalOpen);
  };

  const toggleChangedPasswordModal = () => {
    setIsChangedPasswordModal(!isChangedPasswordModal);
  };

  const toggleConfirmAdminLogged = () => {
    setIsConfirmationAdminLogged(!isConfirmationAdminLogged);
  };

  const toggleErrorModal = () => {
    setIsErrorModalOpen(!isErrorModalOpen);
  };

  const editUser = () => {
    Agent.User.update({
      id: id,
      name: name,
      last_name: lastName,
      role_name: role,
    })
      .then(() => {
        toggleConfirmationUserModal();
        toggleChangedUserModal();
        setNickName(
          `${name.charAt(0).toUpperCase()}${lastName
            .split(" ")[0]
            .charAt(0)
            .toUpperCase()}${lastName.split(" ")[0].slice(1).toLowerCase()}`
        );
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const editPassword = () => {
    Agent.User.changePasswordAdmin({
      nick_name: nickName,
      newPassword: newPassword,
      confirmPassword: confirmNewPassword,
    })
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          toggleConfirmationPasswordModal();
          toggleChangedPasswordModal();
        } else if (response.status === 400) {
          console.error(response.statusText);
        }
      })
      .catch((error) => {
        console.log("error", error.response.data);
        let errorMessages = [];
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const errors = error.response.data.errors;

          for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
              if (Array.isArray(errors[key])) {
                errors[key].forEach((msg) => {
                  errorMessages.push(`${key}: ${msg}`);
                });
              } else {
                errorMessages.push(`${key}: ${errors[key]}`);
              }
            }
          }
        } else {
          errorMessages.push(error.response.data);
        }
        setErrorMessage(errorMessages.join("\n"));
        toggleErrorModal();
      });
  };

  return (
    <div className="max-h-screen bg-white flex-auto flex h-1/2">
      {/* Edit User */}
      <div className="container mx-auto mt-6 ml-52">
        {TableModule.title({ title: "Editar empleado" })}
        {TableModule.inputFilter({
          id: "id",
          label: "Código",
          valueFilter: id.toString(),
          isDisabled: true,
        })}
        {TableModule.inputFilter({
          id: "name",
          label: "Nombre",
          valueFilter: name,
          setOnChangeFilter: setName,
          placeholder: "Nombre",
          errorInput: !Functions.verifyName(name),
          errorMessage: "Nombre inválido",
        })}
        {TableModule.inputFilter({
          id: "lastName",
          label: "Apellido",
          valueFilter: lastName,
          setOnChangeFilter: setLastName,
          placeholder: "Apellido",
          errorInput: !Functions.verifyName(lastName),
          errorMessage: "Apellido inválido",
        })}
        {TableModule.inputFilter({
          id: "rut",
          label: "RUT",
          valueFilter: rut,
          isDisabled: true,
        })}
        {TableModule.inputFilter({
          id: "nickName",
          label: "Nombre de usuario",
          valueFilter: nickName,
          isDisabled: true,
        })}
        {TableModule.selectFilter({
          id: "role",
          label: "Rol",
          valueFilter: role,
          setOnChangeFilter: setRole,
          options: Options.roleOptions,
          firstValue: "SIN ELECCIÓN",
        })}
        <div className="flex items-center space-x-4">
          {isUserModified ? (
            <Buttons.TurquoiseButton
              text="Editar"
              onClick={() => toggleConfirmationUserModal()}
            />
          ) : (
            <Buttons.GrayButton text="Editar" onClick={null} />
          )}
          <Buttons.FuchsiaButton
            text="Cancelar"
            onClick={() => handleNavigate()}
          />
        </div>
      </div>

      {/* Confirmation User Modal */}
      {isConfirmationUserModalOpen && !isConfirmationAdminLogged && (
        <Modal
          title={confirmText}
          confirmAction={setIsConfirmationAdminLogged}
          confirmation="Editar"
          confirmCancel={() => toggleConfirmationUserModal()}
          activateCancel={true}
          activateConfirm={true}
        />
      )}
      {isChangedUserModal && (
        <Modal
          title={changedText}
          confirmation="Aceptar"
          confirmAction={() => {
            toggleChangedUserModal();
            handleNavigate();
          }}
          activateCancel={false}
          activateConfirm={true}
        />
      )}

      <div className="container mx-auto mt-20">
        <img src={cookie} alt="cookie" className="h-auto w-auto opacity-10" />
      </div>

      {/* Edit Password */}
      <div className="container mx-auto mt-6 mr-52">
        {TableModule.title({ title: "Editar contraseña" })}
        {TableModule.inputFilter({
          id: "newPassword",
          label: "Nueva Contraseña",
          valueFilter: newPassword,
          setOnChangeFilter: setNewPassword,
          isPassword: true,
          placeholder: "Alfanumérica y contener al menos 8 caracteres",
        })}
        {TableModule.inputFilter({
          id: "confirmNewPassword",
          label: "Confirmar Contraseña",
          valueFilter: confirmNewPassword,
          setOnChangeFilter: setConfirmNewPassword,
          isPassword: true,
          placeholder: "Alfanumérica y contener al menos 8 caracteres",
          errorInput: !Functions.verifyPasswords(
            newPassword,
            confirmNewPassword
          ),
          errorMessage: newPassword
            ? "Contraseñas no coinciden o inválidas"
            : "",
        })}
        <div className="flex items-center space-x-4">
          {isPasswordModified ? (
            <Buttons.TurquoiseButton
              text="Editar"
              onClick={() => toggleConfirmationPasswordModal()}
            />
          ) : (
            <Buttons.GrayButton text="Editar" onClick={null} />
          )}
          <Buttons.FuchsiaButton
            text="Cancelar"
            onClick={() => handleNavigate()}
          />
        </div>
      </div>

      {/* Confirmation Password Modal */}
      {isConfirmationPasswordModalOpen && !isConfirmationAdminLogged && (
        <Modal
          title={confirmText}
          confirmAction={() => toggleConfirmAdminLogged()}
          confirmation="Editar"
          confirmCancel={() => toggleConfirmationPasswordModal()}
          activateCancel={true}
          activateConfirm={true}
        />
      )}
      {isChangedPasswordModal && (
        <Modal
          title={changedText}
          confirmation="Aceptar"
          confirmAction={() => {
            toggleChangedPasswordModal();
            handleNavigate();
          }}
          activateCancel={false}
          activateConfirm={true}
        />
      )}

      {/* Confirm Admin Logged */}
      {isConfirmationAdminLogged && (
        <ConfirmAdminLogged
          confirmation="Confirmar"
          confirmAction={() => {
            isConfirmationUserModalOpen ? editUser() : editPassword();
          }}
          confirmCancel={() => {
            toggleConfirmAdminLogged();
            isConfirmationUserModalOpen
              ? toggleConfirmationUserModal()
              : toggleConfirmationPasswordModal();
          }}
          activateCancel={true}
          activateConfirm={true}
        />
      )}

      {isErrorModalOpen && (
        <Modal
          title={`Corrija los siguientes errores: ${errorMessage}`}
          confirmation="Aceptar"
          confirmAction={() => {
            toggleErrorModal();
          }}
          activateCancel={false}
          activateConfirm={true}
        />
      )}
    </div>
  );
};

export default EditUserPage;
