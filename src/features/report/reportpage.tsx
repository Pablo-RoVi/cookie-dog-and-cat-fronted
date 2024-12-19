import React from "react";
import Agent from "../../app/api/agent";

const ReportPage = () => {
  return (
    <div>
      <h1>Informes</h1>
      <button
        onClick={() =>
          Agent.SendEmail(
            "pablo.robledo@alumnos.ucn.cl",
            "Camila",
            "Mensaje de prueba"
          )
        }
      >
        Enviar informe
      </button>
    </div>
  );
};

export default ReportPage;
