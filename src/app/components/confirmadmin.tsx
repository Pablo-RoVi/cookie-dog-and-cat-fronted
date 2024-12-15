import React from "react";
import Buttons from "./buttons";
import TableModule from "./tablemodule";

const confirmAdminLogged = (props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-1/3 p-4 rounded-lg">
        <div className="flex justify-center items-center">
          <h2 className="text-xl font-bold">Confirmar Identidad</h2>
        </div>
        <div className="flex justify-center items-center">
          {TableModule.inputFilter({
            label: "Nombre de Usuario",
            valueFilter: props.password,
            setOnChangeFilter: props.setPassword,
          })}
          {TableModule.inputFilter({
            label: "Contraseña",
            valueFilter: props.password,
            setOnChangeFilter: props.setPassword,
            isPassword: true,
          })}
          <div className="flex justify-center gap-8">
            {props.activateConfirm &&
              Buttons.TurquoiseButton({
                text: props.confirmation,
                onClick: props.confirmAction,
              })}
            {props.activateCancel &&
              Buttons.FuchsiaButton({
                text: "Cancelar",
                onClick: props.confirmCancel,
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default confirmAdminLogged;
