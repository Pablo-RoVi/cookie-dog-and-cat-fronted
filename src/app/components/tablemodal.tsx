import React from "react";
import Buttons from "./buttons";
import TableModule from "../../app/components/tablemodule";

const tablemodal = (props) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[60%]">
              <h2 className="text-2xl font-bold text-[#6FC9D1] mb-4">
                {props.title}
              </h2>
              <div className="mb-4">
                {TableModule.inputFilter({
                    placeholder: "Buscar producto por nombre...",
                    onChange: props.onChange,
                    value: props.valueFilter,
                })}
              </div>
              <div>
                {TableModule.table({
                    headers: props.headers,
                    data: props.data
                })}
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

export default tablemodal;