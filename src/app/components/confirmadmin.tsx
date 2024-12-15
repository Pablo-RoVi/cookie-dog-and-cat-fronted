import React, {useState, useEffect } from "react";
import Buttons from "./buttons";
import TableModule from "./tablemodule";
import Color from "../static/colors";
import Agent from "../api/agent";

const ConfirmAdminLogged = (props) => {
  const [nickNameLogged, setNickNameLogged] = useState<string>("");
  const [verifyNickName, setVerifyNickName] = useState<string>("");
  const [verifyPassword, setVerifyPassword] = useState<string>("");
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  useEffect(() => {
    const initializeData = async () => {
      const nickName = localStorage.getItem("nick_name");
      setNickNameLogged(nickName);
    };

    initializeData();
  }, []);
  
  const verifyAdminLogged = () => {
    Agent.Auth.login({
      nick_name: verifyNickName,
      password: verifyPassword,
    })
      .then((response) => {
        if (response.data && response.data.nick_name === nickNameLogged) {
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
              valueFilter: verifyNickName,
              setOnChangeFilter: setVerifyNickName,
              placeholder: "Nombre de Usuario",
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
            !isEmpty(verifyNickName, verifyPassword) ? (
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

export default ConfirmAdminLogged;
