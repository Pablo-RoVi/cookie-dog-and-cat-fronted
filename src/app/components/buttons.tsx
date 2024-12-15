import React from "react";
import colors from "../static/colors";

const EditButton = ({ onClick }) => {
  return (
    <button className="text-white font-bold rounded" onClick={onClick}>
      <svg
        className="w-10 h-10 text-gray-800 dark:text-black"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
        />
      </svg>
    </button>
  );
};

const DeleteButton = ({ onClick }) => {
  return (
    <button className="text-white font-bold rounded" onClick={onClick}>
      <svg
        className="w-10 h-10 text-gray-800 dark:text-black"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
        />
      </svg>
    </button>
  );
};

const DetailButton = ({ onClick, data }) => {
  return (
    <button className="text-white font-bold rounded" onClick={onClick}>
      <svg
        className="w-10 h-10 text-gray-800 dark:text-black"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 3v4a1 1 0 0 1-1 1H5m4 8h6m-6-4h6m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
        />
      </svg>
    </button>
  );
};

const SetStatusButton = ({ isActive, onClick }) => {
  return (
    <button
      className="text-white font-bold rounded border-2 border-black flex items-center justify-center"
      onClick={onClick}
      style={{ backgroundColor: colors.white }}
    >
      {isActive ? (
        <svg
          className="w-6 h-6 text-gray-800 dark:text-black"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 11.917 9.724 16.5 19 7.5"
          />
        </svg>
      ) : (
        <svg
          className="w-6 h-6 text-gray-800 dark:text-black"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18 17.94 6M18 18 6.06 6"
          />
        </svg>
      )}
    </button>
  );
};

const TurquoiseButton = ({ onClick, text }) => {
  return (
    <div className="flex justify-end mt-4">
      <button
        className="text-white font-bold py-2 px-4 rounded"
        style={{ backgroundColor: colors.turquoise }}
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

const FuchsiaButton = ({ onClick, text }) => {
  return (
    <div className="flex justify-end mt-4">
      <button
        className="text-white font-bold py-2 px-4 rounded"
        style={{ backgroundColor: colors.fuchsia }}
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

const GrayButton = ({ onClick, text }) => {
    return (
        <div className="flex justify-end mt-4">
            <button
                className="text-white font-bold py-2 px-4 rounded cursor-not-allowed"
                style={{backgroundColor: colors.gray}}
                onClick={onClick}
            >
                {text}
            </button>
        </div>
    );};

const Buttons = {
  EditButton,
  DeleteButton,
  DetailButton,
  SetStatusButton,
  TurquoiseButton,
  FuchsiaButton,
  GrayButton,
};

export default Buttons;
