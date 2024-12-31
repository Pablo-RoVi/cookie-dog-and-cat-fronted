import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ProductPage from "../../features/product/productpage";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../app/api/agent", () => ({
  Product: {
    list: jest.fn().mockResolvedValue({
      data: [
        {
          unique_id: "12345678",
          product_name: "Carne",
          stock: "20",
          price: "2500",
          categoryName: "Alimento",
          brandName: "Royal",
          specieName: "Perro",
        },
      ],
    }),
  },
}));
describe("ProductPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <Router>
        <ProductPage />
      </Router>
    );
  };

  test("renders all fields", () => {
    renderComponent();

    expect(screen.getByText(/Productos/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Nombre/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Nombre/i)[1]).toBeInTheDocument();
    expect(screen.getByText(/Código/i)).toBeInTheDocument();
    expect(screen.getByText(/Precio/i)).toBeInTheDocument();
    expect(screen.getByText(/Stock/i)).toBeInTheDocument();
    expect(screen.getByText(/Categoria/i)).toBeInTheDocument();
    expect(screen.getByText(/Marca/i)).toBeInTheDocument();
    expect(screen.getByText(/Especie/i)).toBeInTheDocument();
  });
});
