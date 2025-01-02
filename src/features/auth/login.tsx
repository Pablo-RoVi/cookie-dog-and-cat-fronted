import React, { useState, FormEvent, useEffect } from "react";
import "../../app/static/styles/index.css";
import colors from "../../app/static/colors";
import cookie from "../../app/static/images/cookie.png";
import Agent from "../../app/api/agent";
import { useAuth } from "../../app/context/authcontext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setAuthenticated, setUserRoleId, setUserNickName } = useAuth();
  const [nick_name, setNick_Name] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (nick_name !== "" || password !== "") {
      setIsErrorModalOpen(false);
      setErrorMessage("");
    }
  }, [nick_name, password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    Agent.Auth.login({ Nick_name: nick_name, Password: password })
      .then((response) => {
        localStorage.setItem("nickName", response.data.nick_name);
        localStorage.setItem("roleId", response.data.roleId);
        setAuthenticated(true);
        setUserRoleId(response.data.roleId);
        setUserNickName(response.data.nick_name);
        navigate("/sales");
      })
      .catch((err) => {
        setErrorMessage("Credenciales incorrectas");
        setIsErrorModalOpen(true);
        setNick_Name("");
        setPassword("");
      });
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-center bg-gradient-to-br from-[#6FC9D1] to-[#FC67C4]">
      <div
        className="w-[40%] h-[60%] p-8 rounded-3xl shadow-md bg-opacity-50"
        style={{
          backgroundColor: colors.white,
          border: `2px solid ${colors.fuchsia}`,
        }}
      >
        <div className="ml-10 mr-10">
          <img src={cookie} alt="cookie" className="w-[20%] h-[20%] mx-auto" />
          <h3 className="text-3xl text-left mt-4 mb-4 font-extrabold">
            Iniciar Sesión
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <h3 className="text-sm text-left mb-2 font-bold">
                Nombre de usuario
              </h3>
              <input
                type="text"
                placeholder="Nombre de usuario"
                className="w-full p-2 rounded-lg border focus:outline-none text-black"
                value={nick_name}
                onChange={(e) => setNick_Name(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <h3 className="text-sm  text-left mb-3 font-bold">Contraseña</h3>
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full p-2 rounded-lg border focus:outline-none text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="mt-4 justify-center font-medium"
                style={{
                  color: colors.fuchsia,
                  height: "10px",
                  visibility: isErrorModalOpen ? "visible" : "hidden",
                }}
              >
                {isErrorModalOpen && errorMessage}
              </div>
            </div>
            <button
              type="submit"
              className="w-full p-2 mb-4 mt-4 text-white rounded-lg font-bold bg-gradient-to-r bg-[length:600%_100%] bg-left hover:bg-right transition-all duration-500"
              style={{
                backgroundImage: `linear-gradient(to left, ${colors.fuchsia}, ${colors.turquoise})`,
              }}
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;