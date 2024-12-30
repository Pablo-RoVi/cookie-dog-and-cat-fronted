import React, { useState, useEffect } from "react";
import Agent from "../../app/api/agent";
import TableModule from "../../app/components/tablemodule";


const headers = [
  "Código",
  "Cantidad de Productos",
  "Precio Total",
  "Medio de Pago",  
  "Trabajador(a)",
];

const ReportSalesPDF = () => {
    
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
  
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };
  
    initializeData();
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

export default ReportSalesPDF ;