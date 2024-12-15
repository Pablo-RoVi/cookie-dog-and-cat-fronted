import React from "react";
import Buttons from "./buttons";
import TableModule from "./tablemodule";
import Color from "../static/colors";
import Agent from "../api/agent";

const confirmAdminLogged = (props) => {
  const verifyAdminLogged = () => {
    Agent.Auth.login({
      nick_name: props.nickName,
      password: props.password,
    })
      .then((response) => {
        if (response.data && response.data.nick_name === props.nickNameLogged) {
          props.confirmAction();
          props.confirmCancel();
        } else {
          props.setIsInvalid(true);
        }
      })
      .catch((error) => {
        props.setIsInvalid(true);
        console.error("Error al verificar administrador:", error);
      })
      .finally(() => {
        props.setNickName("");
        props.setPassword("");
      });
  };

  const isEmpty = (nickName: string, password: string) => {
    return nickName === "" || password === "";
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
              valueFilter: props.nickName,
              setOnChangeFilter: props.setNickName,
              placeholder: "Nombre de Usuario",
            })}
            {TableModule.inputFilter({
              valueFilter: props.password,
              setOnChangeFilter: props.setPassword,
              placeholder: "Contraseña",
              isPassword: true,
              errorInput:
                props.isInvalid && !isEmpty(props.nickName, props.password),
              errorMessage: "Credenciales inválidas",
            })}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-4">
            {props.activateConfirm &&
            !isEmpty(props.nickName, props.password) ? (
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
                  props.setNickName("");
                  props.setPassword("");
                },
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default confirmAdminLogged;
