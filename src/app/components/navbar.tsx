import React, { useState } from 'react';
import "../static/styles/navbar.css";
import colors from "../static/colors";
import cookie from "../static/images/cookie.png";

const adminMenu = ["Empleados", "Productos", "Ventas", "Informes"];
const employeeMenu= ["Productos", "Ventas"];
const adminSettings = ["Cerrar Sesión"];
const employeeSettings = ["Cambiar Contraseña", "Cerrar Sesión"];
const isAdmin = true;

const Navbar = () => {

    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [loggedName, setLoggedName] = useState<string>("");

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
            <div className="flex-1 text-white flex items-center justify-start relative" style={{background: colors.turquoise}}>
                <svg 
                    onClick={toggleMenu}
                    className="h-10 w-10 text-white m-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <img className="h-14 w-14 m-2" src={cookie} alt="Logo Cookie"></img>
                <text className="text-2xl m-4">COOKIE DOG AND CAT</text>
                {menuOpen && (
                    <ul className="absolute top-full shadow-md rounded p-4" style={{background: colors.turquoiseLight}}>
                        {menu.map((item) => (
                            <li className="cursor-pointer" style={{color: colors.turquoise, textDecorationColor: colors.turquoise}}>{item}</li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="flex-1 bg-white flex items-center justify-center"></div>
            <div className="flex-1 flex items-center justify-end relative" style={{background: colors.fuchsia}}>
                <svg
                    onClick={toggleSettings}
                    className="h-12 w-12 text-white cursor-pointer m-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                {settingsOpen && (
                    <ul className="absolute top-full shadow-md rounded p-4" style={{background: colors.fuchsiaLight}}>
                        <li className="cursor-pointer" style={{color: colors.fuchsia, textDecorationColor: colors.fuchsia}}>{loggedName}</li>
                        {settings.map((item) => (
                            <li className="cursor-pointer" style={{color: colors.fuchsia, textDecorationColor: colors.fuchsia}}>{item}</li>
                        ))}
                    </ul>
                )}
            </div>
        </nav>
    );
}

export default Navbar;