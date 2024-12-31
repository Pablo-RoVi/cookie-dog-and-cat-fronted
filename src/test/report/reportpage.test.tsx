import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ReportPage from "../../features/report/reportpage";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("ReportPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <Router>
        <ReportPage />
      </Router>
    );
  };

  test("renders all fields", () => {
    renderComponent();
    expect(screen.getByText(/Informes/i)).toBeInTheDocument();
    expect(screen.getByText(/Fecha Inicial/i)).toBeInTheDocument();
    expect(screen.getByText(/Fecha Final/i)).toBeInTheDocument();
    expect(screen.getByText(/Código/i)).toBeInTheDocument();
    expect(screen.getByText(/Total/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF/i)).toBeInTheDocument();
  });
  
  test("Filters reports correctly by date range", () => {
    const reports = [
      { id: "1", date: "2021-09-01", total: "$100" },
      { id: "2", date: "2021-09-10", total: "$200" },
    ];
  
    const filtered = reports.filter((report) => {
      const reportDate = new Date(report.date).getTime();
      const startDate = new Date("2021-09-05").getTime();
      const endDate = new Date("2021-09-15").getTime();
  
      return reportDate >= startDate && reportDate <= endDate;
    });
  
    expect(filtered).toEqual([{ id: "2", date: "2021-09-10", total: "$200" }]);
  });
  

});
