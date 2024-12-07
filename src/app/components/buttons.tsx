import React from "react";
import colors from "../static/colors";

const turquoiseButton = (props) => {
    return (
        <button className="text-white font-bold py-2 px-4 rounded" style={{backgroundColor: colors.turquoise}}>
            {props.text}
        </button>
    );
}

const fuchsiaButton = (props) => {
    return (
        <button className="text-white font-bold py-2 px-4 rounded" style={{backgroundColor: colors.fuchsia}}>
            {props.text}
        </button>
    );
}

const buttons = {
    turquoiseButton,
    fuchsiaButton
};

export default buttons;