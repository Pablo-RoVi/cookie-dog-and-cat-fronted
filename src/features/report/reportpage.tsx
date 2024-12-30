import React, { useState, useEffect } from "react";
import Agent from "../../app/api/agent";
import TableModule from "../../app/components/tablemodule";
import Buttons from "../../app/components/buttons";


const headers = ["Código", "Fecha", "Total", "PDF"];

type Report = {
  id: string;
  date: string;
  total: string;
};
const handleGeneratePDF = (date) => {
  localStorage.setItem('reportDate', date);
  window.open(`/reports/pdf`, "_blank");
};

const generateDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dates.push(currentDate.toISOString().split('T')[0]); // Formato 'YYYY-MM-DD'
    currentDate.setDate(currentDate.getDate() + 1); // Incrementa un día
  }

  return dates;
}

const ReportPage = () => {
  const [initialDate, setInitialDate] = useState<string>("");
  const [finalDate, setFinalDate] = useState<string>("");
  const [reports, setReports] = useState<Report[] >([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const reportsPerPage = 8;

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const normalizeReports = (data: Report[] | Report[][]): Report[] => {
    if (Array.isArray(data[0])) {
      // Si el primer elemento es un array, aplanar todos los arrays
      return (data as Report[][]).flat();
    }
    // Si ya es un array plano, devolver tal cual
    return data as Report[];
  };

  const fetchDataInRange = async (startDate: string | null, endDate: string | null): Promise<Report[]> => {
    const allData: Report[] = [];
  
    if (startDate && endDate) {
      // Rango de fechas si ambas fechas están disponibles
      const dates = generateDateRange(startDate, endDate);
      for (const date of dates) {
        try {
          const response = await Agent.Report.getByDate(date);
          console.log("global");
          allData.push(response.data);
          setReports(normalizeReports(allData))
        } catch (error) {
          console.error(`Error al obtener datos para la fecha ${date}:`, error);
        }
      }
    } else if (startDate) {
      // Solo fecha inicial
      try {
        const response = await Agent.Report.getByDate(startDate);
        allData.push(response.data);
        setReports(normalizeReports(allData))
      } catch (error) {
        console.error(`Error al obtener datos para la fecha inicial ${startDate}:`, error);
      }
    } else if (endDate) {
      // Solo fecha final
      try {
        const response = await Agent.Report.getByDate(endDate);
        allData.push(response.data);
        setReports(normalizeReports(allData))
      } catch (error) {
        console.error(`Error al obtener datos para la fecha final ${endDate}:`, error);
      }
    } else {
      console.warn("Se requieren al menos una fecha inicial o final para obtener datos.");
    }
  
    return allData;
  };

  useEffect(() => {
    
    fetchDataInRange(initialDate, finalDate);
  }, []);


  useEffect(() => {
    fetchDataInRange(initialDate, finalDate);
    setCurrentPage(1);
  }, [initialDate, finalDate]);

  const filteredReports = reports.filter((report) => {
    const Datestring = report.date.split('T')[0];
    const reportDate = new Date(Datestring);
    const startDate = initialDate ? new Date(initialDate) : null;
    const endDate = finalDate ? new Date(finalDate) : null;

    return (
      (!startDate || reportDate >= startDate) &&
      (!endDate || reportDate <= endDate)
    );
  });

  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport
  );

  return (
    <div className="max-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {TableModule.title({ title: "Informes" })}
        <div className="flex space-x-4">
          <div className="container max-w-[20%]">
            {TableModule.dateFilter({
              label: "Fecha Inicial",
              valueFilter: initialDate,
              setOnChangeFilter: setInitialDate,
            })}
          </div>
          <div className="container max-w-[20%]">
            {TableModule.dateFilter({
              label: "Fecha Final",
              valueFilter: finalDate,
              setOnChangeFilter: setFinalDate,
              minDate: initialDate,
            })}
          </div>
        </div>
        <div className="mt-6">
          {TableModule.table({
            headers: headers,
            data: currentReports.map((report: Report) => [
              report.id,
              report.date.split('T')[0],
              report.total,
              <>
                <div className="flex justify-center items-center">
                  <Buttons.DownloadPDFButton
                                      onClick={() => handleGeneratePDF(report.date)}
                  />
                </div>
              </>,  
            ]),
          })}
          {TableModule.pagination({
            length: filteredReports.length,
            perPage: reportsPerPage,
            currentPage: currentPage,
            paginate: paginate,
          })}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;