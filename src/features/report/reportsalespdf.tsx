import React, { useState, useEffect, useRef } from "react";
import Agent from "../../app/api/agent";
import TableModule from "../../app/components/tablemodule";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const headers = [
  "Código",
  "Cantidad de Productos",
  "Precio Total",
  "Medio de Pago",  
  "Trabajador(a)",
];

const ReportSalesPDF = () => {
  const generateEmail = async () => {
    const tableElement = document.getElementById("sales-table");
  
    if (!tableElement) {
      console.error("No se encontró la tabla para exportar.");
      return;
    }
  
    try {
      const canvas = await html2canvas(tableElement, {
        scale: 1.5,
        useCORS: true,
      });
  
      const imgData = canvas.toDataURL("image/jpeg");
  
      const pdf = new jsPDF("p", "mm", "a4"); // Formato A4 vertical
  
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      const pdfBase64Full = pdf.output("datauristring");
  
      const pdfData = pdfBase64Full.split(",")[1];

      await fetch("http://localhost:3001", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfData: pdfData,
          filename: "reporte_ventas.pdf",
        }),
      });
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  const generateSalesPDF = async () => {
      const tableElement = document.getElementById("sales-table");
    
      if (!tableElement) {
        console.error("No se encontró la tabla para exportar.");
        return;
      }
    
      try {
        const canvas = await html2canvas(tableElement, {
          scale: 2,
          useCORS: true,
        });
    
        const imgData = canvas.toDataURL("image/png");
    
        const pdf = new jsPDF("p", "mm", "a4");
    
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`reporte_ventas${formatDate(date.split('T')[0])}.pdf`);
        window.close()
      } catch (error) {
        console.error("Error al generar el PDF:", error);
      }
  };

  const hasSentEmail = useRef(false);
  const [sales, setSales] = useState([]);
  const [users, setUsers] = useState([]);
  const date = localStorage.getItem('reportDate');

  const formatDate = (isoDate: string) => {
    console.log(isoDate)
    const [year, month, day] = isoDate.split("-");
    return `${day}-${month}-${year}`;
  };

  const getUserName = (id: number) => {
    const foundUser = users.find((p) => p.value === id);
    return foundUser ? foundUser.label : "Usuario no encontrado";
  };  
  

  useEffect(() => {
    const initializeData = async () => {
      try {
        let reportDate = new Date(date);
        let filteredDate = reportDate.toISOString().split('T')[0];
        const salesResponse = (await Agent.Sale.getByDate(filteredDate)).data;

        setSales(salesResponse);

        const responseUsers = await Agent.User.list();
        const users = responseUsers.data.map((user) => ({
          value: user.id,
          label: user.nick_name,
          isActive: user.is_active,
        }));
        setUsers(users);

        if (!hasSentEmail.current) {
          hasSentEmail.current = true;
          setTimeout(generateEmail, 1000);
          setTimeout(generateSalesPDF, 1000);
        }
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };
  
    initializeData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div id = "sales-table" className="max-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 " >
        {TableModule.title({ title: `Ventas ${formatDate(date.split('T')[0])}`})}
        {/* Tabla */}
        {TableModule.table({
          headers: headers,
          data: sales.map((sale) => {
            return [
              sale.id,
              sale.total_quantity,
              sale.total,
              sale.payment_method,
              getUserName(sale.userId),
            ];
          }),
        })}
      </div>
    </div>
  );
};

export default ReportSalesPDF;