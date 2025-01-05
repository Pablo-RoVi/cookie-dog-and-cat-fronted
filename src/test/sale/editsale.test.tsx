import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import EditSalePage from "../../features/sale/editsalepage";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../app/api/agent", () => ({
  Sale: {
    update: jest.fn().mockResolvedValue({}),
    getPaymentMethods: jest.fn().mockResolvedValue([
      { id: 1, name: "Débito" },
      { id: 2, name: "Transferencia" },
      { id: 3, name: "Efectivo" },
      { id: 4, name: "Cheque" },
      { id: 5, name: "Tarjeta" },

    ]),
  },
}));

describe("EditSalePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <Router>
        <EditSalePage />
      </Router>
    );
  };

  test("renders all fields", () => {
    renderComponent();
    expect(screen.getByText(/Editar venta/i)).toBeInTheDocument();
    expect(screen.getByText(/Código/i)).toBeInTheDocument();
    expect(screen.getByText(/Nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByText(/Método de pago/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Producto/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Producto/i)[1]).toBeInTheDocument();
    expect(screen.getAllByText(/Producto/i)[2]).toBeInTheDocument();
    expect(screen.getByText(/Marca/i)).toBeInTheDocument();
    expect(screen.getByText(/Categoría/i)).toBeInTheDocument();
    expect(screen.getByText(/Especie/i)).toBeInTheDocument();
    expect(screen.getByText(/Precio Unitario/i)).toBeInTheDocument();
    expect(screen.getByText(/Cantidad/i)).toBeInTheDocument();
    expect(screen.getByText(/Total producto/i)).toBeInTheDocument();
  });

  test("renders all buttons", () => {
    renderComponent();
    expect(screen.getAllByText(/Editar/i)[1]).toBeInTheDocument();
    expect(screen.getByText(/Cancelar/i)).toBeInTheDocument();
  });

  test("redirects on successful edit", async () => {
    renderComponent();

    const button = screen.getAllByText(/Editar/i)[1];

    fireEvent.click(button);

  });
});
