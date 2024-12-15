import React, { useState, useEffect } from "react";
import Buttons from "./buttons";
import TableModule from "./tablemodule";
import Functions from "../../app/components/functions";
import Color from "../static/colors";
import Agent from "../api/agent";
import { useAuth } from "../../app/context/authcontext";

const ChangePassword = (props) => {
  const { userNickName } = useAuth();

  const [verifyNickName, setVerifyNickName] = useState<string>("");
  const [verifyPassword, setVerifyPassword] = useState<string>("");
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [isPasswordModified, setIsPasswordModified] = useState<boolean>(false);

  const verifyEmployeeLogged = () => {
    Agent.Auth.login({
      nick_name: verifyNickName,
      password: verifyPassword,
    })
      .then((response) => {
        if (response.data && response.data.nick_name === userNickName) {
          props.confirmAction();
          props.confirmCancel();
        } else {
          setIsInvalid(true);
          console.error("Credenciales inválidas");
        }
      })
      .catch((error) => {
        setIsInvalid(true);
        console.error("Error al verificar administrador:", error);
      })
      .finally(() => {
        setVerifyNickName("");
        setVerifyPassword("");
      });
  };

  useEffect(() => {
    setIsPasswordModified(
      Functions.verifyPasswords(newPassword, confirmNewPassword)
    );
  }, [newPassword, confirmNewPassword]);

  const isEmpty = (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) => {
    return (
      currentPassword === "" || newPassword === "" || confirmNewPassword === ""
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white w-1/6 p-4 rounded-lg">
        <div className="text-center">
          <h2 className="text-xl font-bold" style={{ color: Color.turquoise }}>
            Cambiar Contraseña
          </h2>
        </div>
        <div className="relative h-52">
          <div className="container mx-auto mt-6">
            {TableModule.inputFilter({
              valueFilter: currentPassword,
              setOnChangeFilter: setCurrentPassword,
              placeholder: "Contraseña Actual",
              isPassword: true,
              errorInput: isInvalid,
              errorMessage: "Credenciales inválidas",
            })}
            {TableModule.inputFilter({
              valueFilter: verifyPassword,
              setOnChangeFilter: setVerifyPassword,
              placeholder: "Nueva Contraseña",
              isPassword: true,
              errorInput: isInvalid,
              errorMessage: "Credenciales inválidas",
            })}
            {TableModule.inputFilter({
              valueFilter: confirmNewPassword,
              setOnChangeFilter: setConfirmNewPassword,
              placeholder: "Confirmar Nueva Contraseña",
              isPassword: true,
              errorInput: isInvalid,
              errorMessage: "Credenciales inválidas",
            })}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-4">
            {props.activateConfirm &&
            !isEmpty(currentPassword, verifyNickName, verifyPassword) ? (
              Buttons.TurquoiseButton({
                text: props.confirmation,
                onClick: verifyEmployeeLogged,
              })
            ) : (
              <Buttons.GrayButton text="Confirmar" onClick={null} />
            )}
            {props.activateCancel &&
              Buttons.FuchsiaButton({
                text: "Cancelar",
                onClick: () => {
                  props.confirmCancel();
                  setVerifyNickName("");
                  setVerifyPassword("");
                },
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
