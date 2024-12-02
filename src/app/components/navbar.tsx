import React from 'react';
import "../static/styles/navbar.css";

const Navbar = () => {
    return (
        <nav className="flex">
            <div className="flex-1 bg-[#6FC9D1] text-white">
                <ul className="flex justify-center space-x-4 py-4">
                <li className="cursor-pointer hover:underline">COOKIE DOG AND CAT</li>
                </ul>
            </div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-[#FC67C4]"></div>
        </nav>
    );
}

export default Navbar;