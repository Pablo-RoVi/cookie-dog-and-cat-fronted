import React, { useState } from "react";
import Buttons from "./buttons";
import TableModule from "./tablemodule";
import Color from "../static/colors";
import Agent from "../api/agent";
import { useAuth } from "../../app/context/authcontext";

const ConfirmAdminLogged = (props) => {
  const { userNickName } = useAuth();

  const [verifyPassword, setVerifyPassword] = useState<string>("");
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  
  const verifyAdminLogged = () => {
    Agent.Auth.login({
      nick_name: userNickName,
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
        setVerifyPassword("");
      });
  };

  const isEmpty = (password: string) => {
    return password === "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white w-1/6 p-4 rounded-lg">
        <div className="text-center">
          <h2 className="text-xl font-bold" style={{ color: Color.turquoise }}>
            Confirmar Identidad
          </h2>
        </div>
        <div className="relative h-52">
          <div className="container mx-auto mt-6">
            {TableModule.inputFilter({
              valueFilter: userNickName,
              placeholder: "Nombre de Usuario",
              isDisabled: true,
            })}
            {TableModule.inputFilter({
              valueFilter: verifyPassword,
              setOnChangeFilter: setVerifyPassword,
              placeholder: "Contraseña",
              isPassword: true,
              errorInput:isInvalid,
              errorMessage: "Credenciales inválidas",
            })}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-4">
            {props.activateConfirm &&
            !isEmpty(verifyPassword) ? (
              Buttons.TurquoiseButton({
                text: props.confirmation,
                onClick: verifyAdminLogged,
              })
            ) : (
              <Buttons.GrayButton text="Confirmar" onClick={null} />
            )}
            {props.activateCancel &&
              Buttons.FuchsiaButton({
                text: "Cancelar",
                onClick: () => {
                  props.confirmCancel();
                  setVerifyPassword("");
                },
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAdminLogged;
