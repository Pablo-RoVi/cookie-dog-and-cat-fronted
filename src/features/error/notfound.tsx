import React from "react";
import { useNavigate } from "react-router-dom";
import Buttons from "../../app/components/buttons";
import cookie from "../../app/static/images/cookie.png";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <div className="container mx-auto max-w-[20%]">
        <img src={cookie} alt="cookie" className="h-auto w-auto opacity-10 grayscale" />
      </div>
      <h1 className="text-8xl font-bold mb-4">¡Oops!</h1>
      <h1 className="text-4xl font-bold mb-4">
        Parece que no encontramos lo que estabas buscando.
      </h1>
      <h1 className="text-2xl font-bold mb-4">
        Es posible que la página que solicitaste no exista o haya cambiado su
        ubicación.
      </h1>
      <Buttons.GrayButton text="Volver" onClick={() => handleGoBack()} />
    </div>
  );
};

export default NotFound;
