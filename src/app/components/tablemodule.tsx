import React from "react";
import colors from "../static/colors";

const title = (props) => {
  return (
    <h1 className="text-4xl font-bold mb-6" style={{ color: colors.turquoise }}>
      {props.title}
    </h1>
  );
};

const inputFilter = (props) => {
  return (
    <div className="container mx-auto  flex flex-col space-y-2 w-auto mb-6">
      {/* Texto arriba del input */}
      <label className="text-xl font-bold" style={{ color: colors.turquoise }}>
        {props.label}
      </label>
      {/* Input */}
      <input
        type={props.isPassword ? "password" : "text"}
        value={props.valueFilter}
        onChange={(e) => props.setOnChangeFilter(e.target.value)}
        placeholder={props.placeholder}
        className="p-2 border border-gray-300 rounded-lg shadow-sm"
        disabled={props.isDisabled}
      />
      {/* Mensaje de error */}
      {props.errorInput && (
        <span className="text-red-500">{props.errorMessage}</span>
      )}
    </div>
  );
};

const selectFilter = (props) => {
  return (
    <div className="flex flex-col space-y-2 w-auto mb-4">
      {/* Texto arriba del select */}
      <label className="text-xl font-bold" style={{ color: colors.turquoise }}>
        {props.label}
      </label>
      {/* Select */}
      <select
        value={props.valueFilter}
        onChange={(e) => props.setOnChangeFilter(e.target.value)}
        className="p-2 border border-gray-300 rounded-lg shadow-sm"
        disabled={props.isDisabled}
      >
        <option value={props.firstValue}>{props.firstValue}</option>
        {props.options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const table = (props) => {
  return (
    <table className="table-fixed w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead>
        <tr className="text-white" style={{ backgroundColor: colors.fuchsia }}>
          {props.headers.map((header) => (
            <th
              key={header}
              className="text-center py-3 px-4 font-semibold text-sm"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.data.map((row, index) => (
          <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
            {row.map((cell, index) => (
              <td key={index} className="py-3 px-4 text-center">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

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
                ? { backgroundColor: colors.fuchsia }
                : { backgroundColor: colors.gray }
            }
          >
            {page + 1}
          </button>
        )
      )}
    </div>
  );
};

const tablemodule = {
  title,
  inputFilter,
  selectFilter,
  table,
  pagination,
};

export default tablemodule;
