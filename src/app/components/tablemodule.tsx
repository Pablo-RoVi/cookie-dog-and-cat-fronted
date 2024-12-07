import React from "react";
import colors from "../static/colors";

const table = (props) => {
    return (
        <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
                <tr className="text-white" style={{backgroundColor: colors.fuchsia}}>
                    {props.headers.map((header) => (
                        <th className="text-left py-3 px-4 font-semibold text-sm">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {props.data.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                        {row.map((cell, index) => (
                            <td key={index} className="py-3 px-4">{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

const pagination = (props) => {
    return (
        <div className="flex justify-center mt-4 space-x-2">
            {[...Array(Math.ceil(props.length / props.perPage)).keys()].map(
                (page) => (
                    <button
                        key={page + 1}
                        onClick={() => props.paginate(page + 1)}
                        className={`px-3 py-1 rounded ${
                            props.currentPage === page + 1
                                ? "bg-pink-500 text-white"
                                : "bg-gray-300"
                        }`}
                    >
                        {page + 1}
                    </button>
                )
            )}
        </div>
    );
}

const tablemodule = {
    table,
    pagination
};

export default tablemodule;