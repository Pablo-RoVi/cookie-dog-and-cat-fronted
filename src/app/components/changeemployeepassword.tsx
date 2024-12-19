import React, { useState, useEffect } from "react";
import Buttons from "./buttons";
import TableModule from "./tablemodule";
import Functions from "../../app/components/functions";
import Color from "../static/colors";
import Agent from "../api/agent";
import { useAuth } from "../../app/context/authcontext";

const ChangeEmployeePassword = (props) => {
  const { userNickName } = useAuth();

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [isPasswordVerify, setIsPasswordVerify] = useState<boolean>(false);

  const verifyEmployeeLogged = () => {
    Agent.Users.changePasswordEmployee({
      nick_name: userNickName,
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmPassword: confirmNewPassword,
    })
      .then(() => {
        props.confirmCancel();
        props.confirmAction();
      })
      .catch((error) => {
        console.error("Error al verificar administrador:", error);
      });
  };

  useEffect(() => {
    setIsPasswordVerify(
      Functions.verifyPasswords(newPassword, confirmNewPassword)
    );
  }, [newPassword, confirmNewPassword]);

  const isEmpty = (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) => {
    return (
      currentPassword === "" && newPassword === "" && confirmNewPassword === ""
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white w-1/3 rounded-lg shadow-lg">
        <h2
          className="text-center text-4xl font-bold mb-4 mt-4"
          style={{ color: Color.turquoise }}
        >
          Cambiar Contraseña
        </h2>
        <div className="w-3/4 mx-auto">
          {TableModule.inputFilter({
            label: "Contraseña Actual",
            valueFilter: currentPassword,
            setOnChangeFilter: setCurrentPassword,
            placeholder: "Contraseña Actual",
            isPassword: true,
          })}
          {TableModule.inputFilter({
            label: "Nueva Contraseña",
            valueFilter: newPassword,
            setOnChangeFilter: setNewPassword,
            placeholder: "Alfanumérica y contener al menos 8 caracteres",
            isPassword: true,
          })}
          {TableModule.inputFilter({
            label: "Confirmar Nueva Contraseña",
            valueFilter: confirmNewPassword,
            setOnChangeFilter: setConfirmNewPassword,
            placeholder: "Debe coincidir con tu nueva contraseña",
            isPassword: true,
            errorInput: !Functions.verifyPasswords(
              newPassword,
              confirmNewPassword
            ),
            errorMessage: newPassword ? "Credenciales inválidas" : "",
          })}
        </div>
        <div className="flex justify-center gap-4 mb-4">
          {isPasswordVerify &&
          !isEmpty(currentPassword, newPassword, confirmNewPassword) ? (
            Buttons.TurquoiseButton({
              text: "Confirmar",
              onClick: verifyEmployeeLogged,
            })
          ) : (
            <Buttons.GrayButton text="Confirmar" onClick={null} />
          )}
          {Buttons.FuchsiaButton({
            text: "Cancelar",
            onClick: () => {
              props.confirmCancel();
            },
          })}
        </div>
      </div>
    </div>
  );
};

export default ChangeEmployeePassword;
