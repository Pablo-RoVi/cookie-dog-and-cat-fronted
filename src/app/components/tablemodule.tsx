import React from "react";
import colors from "../static/colors";

const selectFilter = (props) => {
    return (
        <select
            value={props.valueFilter}
            onChange={(e) => props.setOnChangeFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm w-1/3"
        >
            <option value="">{props.placeholder}</option>
            {props.options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

const table = (props) => {
    return (
        <table className="table-fixed w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
                <tr className="text-white" style={{backgroundColor: colors.fuchsia}}>
                    {props.headers.map((header) => (
                        <th key={header} className="text-center py-3 px-4 font-semibold text-sm">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {props.data.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                        {row.map((cell, index) => (
                            <td key={index} className="py-3 px-4 text-center">{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

const pagination = (props) => {
    return (
        <div className="flex justify-end mt-6 space-x-2">
            {[...Array(Math.ceil(props.length / props.perPage)).keys()].map(
                (page) => (
                    <button
                        key={page + 1}
                        onClick={() => props.paginate(page + 1)}
                        className={"px-3 py-1 rounded text-white"}
                        style={
                            props.currentPage === page + 1
                                ? {backgroundColor: colors.fuchsia}
                                : {backgroundColor: colors.gray}
                        }
                    >
                        {page + 1}
                    </button>
                )
            )}
        </div>
    );
}

const tablemodule = {
    selectFilter,
    table,
    pagination
};

export default tablemodule;