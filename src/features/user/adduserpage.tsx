import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cookie from "../../app/static/images/cookie.png";
import TableModule from "../../app/components/tablemodule";
import Functions from "../../app/components/functions";
import Buttons from "../../app/components/buttons";
import Options from "../../app/components/options";
import Modal from "../../app/components/modal";
import ConfirmAdminLogged from "../../app/components/confirmadmin";
import Agent from "../../app/api/agent";
import { AxiosResponse } from "axios";

const AddUserPage = () => {
  const [name, setName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [rut, setRut] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);

  const [isConfirmationAdminLogged, setIsConfirmationAdminLogged] =
    useState<boolean>(false);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  const [isFormCompleted, setIsFormCompleted] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    setIsFormCompleted(false);
    if (
      role &&
      Functions.verifyName(name + " " + lastName) &&
      Functions.verifyPasswords(newPassword, confirmNewPassword) &&
      Functions.verifyRut(rut)
    ) {
      setIsFormCompleted(true);
    } else {
      setIsFormCompleted(false);
    }
  }, [name, lastName, rut, role, newPassword, confirmNewPassword]);

  const handleNavigate = () => {
    navigate("/users");
  };

  const toggleConfirmationModal = () => {
    setIsConfirmationModalOpen(!isConfirmationModalOpen);
  };

  const toggleConfirmAdminLogged = () => {
    setIsConfirmationAdminLogged(!isConfirmationAdminLogged);
  };

  const toggleErrorModal = () => {
    setIsErrorModalOpen(!isErrorModalOpen);
  };

  const toggleSuccessModal = () => {
    setIsSuccessModalOpen(!isSuccessModalOpen);
  };

  const restartUserForm = () => {
    setName("");
    setLastName("");
    setRut("");
    setRole("SIN ELECCIÓN");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const registerUser = () => {
    Agent.User.add({
      rut: rut,
      name: name,
      last_name: lastName,
      password: newPassword,
      confirmPassword: confirmNewPassword,
      roleName: role,
    })
      .then((response: AxiosResponse) => {
        if (response.status === 204) {
          toggleSuccessModal();
        } else if (response.status === 400) {
          console.error(response.statusText);
        }
      })
      .catch((error) => {
        console.log("error", error.response);
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
                  errorMessages.push(`${msg}`);
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
      <div className="container mx-auto mt-6 ml-52 max-w-[30%]">
        {TableModule.title({ title: "Registrar nuevo empleado" })}
        {TableModule.inputFilter({
          id: "name",
          label: "Nombres",
          valueFilter: name,
          setOnChangeFilter: setName,
          placeholder: "Ejemplo: Gonzalo Hernán",
          errorInput: !Functions.verifyName(name) && name !== "",
          errorMessage: "Nombre inválido",
        })}
        {TableModule.inputFilter({
          id: "lastName",
          label: "Apellidos",
          valueFilter: lastName,
          setOnChangeFilter: setLastName,
          placeholder: "Ejemplo: González Hernández",
          errorInput: !Functions.verifyName(lastName) && lastName !== "",
          errorMessage: "Apellido inválido",
        })}
        {TableModule.inputFilter({
          id: "rut",
          label: "RUT",
          valueFilter: rut,
          setOnChangeFilter: setRut,
          placeholder: "Ejemplo: 12345678-9",
          errorInput: !Functions.verifyRut(rut) && rut !== "",
          errorMessage: "RUT inválido",
        })}
        {TableModule.inputFilter({
          label: "Nombre de Usuario",
          valueFilter: `${name.charAt(0).toUpperCase()}${lastName
            .split(" ")[0]
            .charAt(0)
            .toUpperCase()}${lastName.split(" ")[0].slice(1).toLowerCase()}`,
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
        {TableModule.inputFilter({
          id: "newPassword",
          label: "Contraseña",
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
          {isFormCompleted ? (
            <Buttons.TurquoiseButton
              text="Añadir"
              onClick={() => toggleConfirmationModal()}
            />
          ) : (
            <Buttons.GrayButton text="Añadir" onClick={null} />
          )}
          <Buttons.FuchsiaButton
            text="Cancelar"
            onClick={() => handleNavigate()}
          />
        </div>
      </div>
      {isConfirmationModalOpen && (
        <Modal
          title={`¿Estás seguro de que deseas registrar a '${name} ${lastName}' de RUT '${rut}' y rol '${Functions.translateRole(
            role
          )}'?`}
          confirmAction={() => {
            toggleConfirmAdminLogged();
            toggleConfirmationModal();
          }}
          confirmation="Añadir"
          confirmCancel={() => toggleConfirmationModal()}
          activateCancel={true}
          activateConfirm={true}
        />
      )}

      {isConfirmationAdminLogged && (
        <ConfirmAdminLogged
          confirmation="Confirmar"
          confirmAction={() => {
            toggleConfirmAdminLogged();
            registerUser();
          }}
          confirmCancel={() => {
            toggleConfirmAdminLogged();
          }}
          activateCancel={true}
          activateConfirm={true}
        />
      )}

      {isSuccessModalOpen && (
        <Modal
          title={"Usuario registrado con éxito"}
          confirmation="Aceptar"
          confirmAction={() => {
            toggleSuccessModal();
            restartUserForm();
          }}
          activateCancel={false}
          activateConfirm={true}
        />
      )}

      {isErrorModalOpen && (
        <Modal
          title={`Corrija los siguientes errores: ${errorMessage}`}
          confirmation="Aceptar"
          confirmAction={() => toggleErrorModal()}
          activateCancel={false}
          activateConfirm={true}
        />
      )}

      <div className="container mx-auto mr-52 ml-40">
        <img src={cookie} alt="cookie" className="h-auto w-auto opacity-10" />
      </div>
    </div>
  );
};
export default AddUserPage;
