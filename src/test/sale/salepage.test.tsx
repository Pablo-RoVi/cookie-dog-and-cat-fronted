import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import SalePage from "../../features/sale/salepage";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../app/api/agent", () => ({
  User: {
    list: jest.fn().mockResolvedValue({}),
  },
}));
describe("SalePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <Router>
        <SalePage />
      </Router>
    );
  };

  test("renders all fields", () => {
    renderComponent();
    expect(screen.getByText(/Ventas/i)).toBeInTheDocument();
    expect(screen.getByText(/Código/i)).toBeInTheDocument();
    expect(screen.getByText(/Producto/i)).toBeInTheDocument();
    expect(screen.getByText(/Precio Total/i)).toBeInTheDocument();
    expect(screen.getByText(/Medio de Pago/i)).toBeInTheDocument();
    expect(screen.getByText(/Trabajador/i)).toBeInTheDocument();
    expect(screen.getByText(/Nombre de usuario/i)).toBeInTheDocument();
  });

  test("renders all buttons", () => {
    renderComponent();
    expect(screen.getByText(/SIN ELECCIÓN/i)).toBeInTheDocument();
    expect(screen.getByText(/Añadir/i)).toBeInTheDocument();
  });
});
