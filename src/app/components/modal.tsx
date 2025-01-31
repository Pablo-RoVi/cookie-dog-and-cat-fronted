import React from "react";
import Buttons from "./buttons";

const modal = (props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-1/3 p-4 rounded-lg">
        <div className="flex justify-center items-center">
          <h2 className="text-xl font-bold whitespace-pre-wrap">{props.title}</h2>
        </div>
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
  );
};

export default modal;
