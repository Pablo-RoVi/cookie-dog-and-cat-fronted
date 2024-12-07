import React from "react";
import colors from "../static/colors";

const turquoiseButton = (props) => {
    return (
        <div className="flex justify-end mt-4">
            <button className="text-white font-bold py-2 px-4 rounded" style={{backgroundColor: colors.turquoise}}>
                {props.text}
            </button>
        </div>
    );
}

const fuchsiaButton = (props) => {
    return (
        <div className="flex justify-end mt-4">
            <button className="text-white font-bold py-2 px-4 rounded" style={{backgroundColor: colors.fuchsia}}>
                {props.text}
            </button>
        </div>
    );
}

const buttons = {
    turquoiseButton,
    fuchsiaButton
};

export default buttons;