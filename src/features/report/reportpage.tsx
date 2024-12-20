import React, { useState, useEffect } from "react";
import TableModule from "../../app/components/tablemodule";
import Buttons from "../../app/components/buttons";

const headers = ["Código", "Fecha", "Total", "PDF"];

type Report = {
  id: string;
  date: string;
  total: string;
};

const reportsExamples: Report[] = [
  { id: "1", date: "2021-09-01", total: "$100" },
  { id: "2", date: "2021-09-02", total: "$200" },
  { id: "3", date: "2021-09-03", total: "$300" },
  { id: "4", date: "2021-09-04", total: "$400" },
  { id: "5", date: "2021-09-05", total: "$500" },
  { id: "6", date: "2021-09-06", total: "$600" },
  { id: "7", date: "2021-09-07", total: "$700" },
  { id: "8", date: "2021-09-08", total: "$800" },
  { id: "9", date: "2021-09-09", total: "$900" },
  { id: "10", date: "2021-09-10", total: "$1000" },
  { id: "11", date: "2021-09-11", total: "$1100" },
  { id: "12", date: "2021-09-12", total: "$1200" },
  { id: "13", date: "2021-09-13", total: "$1300" },
  { id: "14", date: "2021-09-14", total: "$1400" },
  { id: "15", date: "2021-09-15", total: "$1500" },
  { id: "16", date: "2021-09-16", total: "$1600" },
  { id: "17", date: "2021-09-17", total: "$1700" },
  { id: "18", date: "2021-09-18", total: "$1800" },
  { id: "19", date: "2021-09-19", total: "$1900" },
  { id: "20", date: "2021-09-20", total: "$2000" },
  { id: "21", date: "2021-09-21", total: "$2100" },
  { id: "22", date: "2021-09-22", total: "$2200" },
  { id: "23", date: "2021-09-23", total: "$2300" },
  { id: "24", date: "2021-09-24", total: "$2400" },
];

const ReportPage = () => {
  const [initialDate, setInitialDate] = useState<string>("");
  const [finalDate, setFinalDate] = useState<string>("");
  const [reports, setReports] = useState<Report[]>(reportsExamples);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const reportsPerPage = 8;

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [initialDate, finalDate]);

  const filteredReports = reports.filter((report) => {
    const reportDate = new Date(report.date);
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
              report.date,
              report.total,
              <>
                <div className="flex justify-center items-center">
                  <Buttons.DownloadPDFButton
                    onClick={() => null}
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
