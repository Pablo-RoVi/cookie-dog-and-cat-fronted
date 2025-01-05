import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import DetailSalePage from "../../features/sale/detailsalepage";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("DetailSalePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <Router>
        <DetailSalePage />
      </Router>
    );
  };

  test("renders all fields", () => {
    renderComponent();
    expect(screen.getByText(/Detalles de venta/i)).toBeInTheDocument();
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
    
    expect(screen.getByText(/Volver/i)).toBeInTheDocument();
  });

  test("clicks on back", () => {
    renderComponent();
    fireEvent.click(screen.getByText(/Volver/i));
    expect(mockNavigate).toHaveBeenCalled();
  });
});
