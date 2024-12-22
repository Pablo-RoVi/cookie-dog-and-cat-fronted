import React, { useState, FormEvent } from "react";
import "../../app/static/styles/index.css";
import colors from "../../app/static/colors";
import cookie from "../../app/static/images/cookie.png";
import TableModal from "../../app/components/tablemodal";
import { useAuth } from "../../app/context/authcontext";

const Login = () => {
  const [nick_name, setNick_Name] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);

  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(nick_name, password);
    } catch (err) {
      setErrorMessage("Credenciales incorrectas");
      setIsErrorModalOpen(true);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen w-full bg-center bg-cover text-white "
      style={{ backgroundImage: `url(${cookie})` }}
    >
      <div
        className="w-96 p-8 rounded-3xl shadow-md bg-opacity-50"
        style={{ backgroundColor: colors.fuchsiaTransparent }}
      >
        <div className="ml-10 mr-10">
          <h3 className="text-3xl text-left mt-2 mb-7">Iniciar Sesión</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <h3 className="text-sm text-left mb-2">Nombre de usuario</h3>
              <input
                type="text"
                placeholder="Nombre de usuario"
                className="w-full p-2 rounded-lg border focus:outline-none text-black"
                value={nick_name}
                onChange={(e) => setNick_Name(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <h3 className="text-sm  text-left mb-3 ">Contraseña</h3>
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full p-2 rounded-lg border focus:outline-none text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="text-sm mt-2"
                style={{
                  color: colors.white,
                  height: "10px",
                  visibility: isErrorModalOpen ? "visible" : "hidden",
                }}
              >
                {isErrorModalOpen && errorMessage}
              </div>
            </div>
            <button
              type="submit"
              className="w-full p-2 mb-10 mt-10 text-white rounded-lg "
              style={{ backgroundColor: colors.turquoise }}
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
