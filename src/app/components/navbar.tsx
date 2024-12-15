import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../static/styles/navbar.css";
import colors from "../static/colors";
import cookie from "../static/images/cookie.png";
import { useAuth } from "../../app/context/authcontext";
const adminMenu = [
  {
    value: "/users",
    label: "Empleados",
  },
  {
    value: "/products",
    label: "Productos",
  },
  {
    value: "/sales",
    label: "Ventas",
  },
  {
    value: "/reports",
    label: "Reportes",
  },
];
const employeeMenu = [
  {
    value: "/products",
    label: "Productos",
  },
  {
    value: "/sales",
    label: "Ventas",
  },
];
const adminSettings = [{ value: "/login", label: "Cerrar Sesión" }];
const employeeSettings = [
  {
    value: "/profile",
    lable: "Cambiar Contraseña",
  },
  {
    value: "/Login",
    label: "Cerrar Sesión",
  },
];

const Navbar = () => {
  const { logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [loggedName, setLoggedName] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(true);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const menu = isAdmin ? adminMenu : employeeMenu;
  const settings = isAdmin ? adminSettings : employeeSettings;

  return (
    <nav className="flex">
      <div
        className="flex-1 text-white flex items-center justify-start relative"
        style={{ background: colors.turquoise }}
      >
        <svg
          onClick={toggleMenu}
          className="w-10 h-10 text-gray-800 dark:text-white ml-6 mr-4 cursor-pointer"
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
            strokeWidth="2"
            d="M5 7h14M5 12h14M5 17h14"
          />
        </svg>
        <img className="h-14 w-14 m-2" src={cookie} alt="Logo Cookie"></img>
        <h1 className="text-2xl m-4">COOKIE DOG AND CAT</h1>
        {menuOpen && (
          <ul
            className="absolute top-full shadow-md rounded p-4"
            style={{ background: colors.turquoiseLight }}
          >
            {menu.map((item) => (
              <li
                key={item.label}
                className="cursor-pointer mb-2"
                style={{
                  color: colors.turquoise,
                  textDecorationColor: colors.turquoise,
                }}
                onClick={() => navigate(item.value)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex-1 bg-white flex items-center justify-center"></div>
      <div
        className="flex-1 flex items-center justify-end relative"
        style={{ background: colors.fuchsia }}
      >
        <svg
          onClick={toggleSettings}
          className="w-12 h-12 text-gray-800 dark:text-white mr-6"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
            clipRule="evenodd"
          />
        </svg>
        {settingsOpen && (
          <ul
            className="absolute top-full shadow-md rounded p-4"
            style={{ background: colors.fuchsiaLight }}
          >
            <li
              className="cursor-pointer"
              style={{
                color: colors.fuchsia,
                textDecorationColor: colors.fuchsia,
              }}
            >
              {loggedName}
            </li>
            {settings.map((item) => (
              <li
                key={item.label}
                className="cursor-pointer mb-2"
                style={{
                  color: colors.fuchsia,
                  textDecorationColor: colors.fuchsia,
                }}
                onClick={() => {
                  logout();
                  navigate(item.value);
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
