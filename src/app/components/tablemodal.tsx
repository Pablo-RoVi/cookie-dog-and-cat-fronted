import React from "react";
import Buttons from "./buttons";
import TableModule from "../../app/components/tablemodule";
// eslint-disable-next-line
import { isDisabled } from "@testing-library/user-event/dist/utils";

const tablemodal = (props) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] max-h-[80%] flex flex-col">
                <h2 className="text-2xl font-bold text-[#6FC9D1] mb-4">
                    {props.title}
                </h2>
                <div className="max-w-[50%] mb-4">
                    {TableModule.inputFilter({
                        placeholder: "Buscar producto por nombre...",
                        onChange: props.onChange,
                        value: props.valueFilter,
                        isDisabled: props.data.length === 0,
                    })}
                </div>
                <div className="flex-grow overflow-y-auto">
                    {TableModule.table({
                    headers: props.headers,
                    data: props.data,

                    })}
                </div>
                <div className="flex justify-center gap-8 mt-4">
                    {props.activateConfirm && !props.disableButton &&
                    Buttons.TurquoiseButton({
                    text: props.confirmation,
                    onClick: props.confirmAction,
                    })}
                    {(props.data.length === 0 || props.disableButton) &&
                    Buttons.GrayButton({
                    text: props.confirmation,
                    onClick: null,
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