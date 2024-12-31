import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AddSalePage from "../../features/sale/addsalepage";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../app/api/agent", () => ({
  Sale: {
    add: jest.fn().mockResolvedValue({}),
  },
}));

describe("AddSalePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <Router>
        <AddSalePage />
      </Router>
    );
  };

  test("renders all fields", () => {
    renderComponent();
    expect(screen.getByText(/Registrar nueva venta/i)).toBeInTheDocument();
    expect(screen.getByText(/Nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByText(/Método de pago/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Producto/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Producto/i)[1]).toBeInTheDocument();
    expect(screen.getByText(/Marca/i)).toBeInTheDocument();
    expect(screen.getByText(/Categoría/i)).toBeInTheDocument();
    expect(screen.getByText(/Especie/i)).toBeInTheDocument();
    expect(screen.getByText(/Precio Unitario/i)).toBeInTheDocument();
    expect(screen.getByText(/Cantidad/i)).toBeInTheDocument();
    expect(screen.getByText(/Total producto/i)).toBeInTheDocument();
  });

  test("renders all buttons", () => {
    renderComponent();
    expect(screen.getByText(/SIN ELECCIÓN/i)).toBeInTheDocument();
    expect(screen.getByText(/Añadir/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancelar/i)).toBeInTheDocument();
  });

  test("redirects on successful add", async () => {
    renderComponent();
    const paymentMethod = screen.getByText(/SIN ELECCIÓN/i);

    const button = screen.getByText(/Añadir/i);

    fireEvent.change(paymentMethod, {
      target: { value: "Tarjeta" },
    });

    fireEvent.click(button);
    
  });

  test("redirects on cancel", async () => {
    renderComponent();
    const button = screen.getByText(/Cancelar/i);

    fireEvent.click(button);
  });
  
});
