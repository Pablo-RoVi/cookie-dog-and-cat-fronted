import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import EditProductPage from "../../features/product/editproductpage";
import Agent from "../../app/api/agent";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../app/api/agent", () => ({
  Product: {
    add: jest.fn(),
  },
  Brand: {
    list: jest.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          brand_name: "Royal",
        },
        {
          id: 2,
          brand_name: "StreetDogs",
        },
      ],
    }),
    add: jest.fn(),
  },
}));

describe("EditProductPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <Router>
        <EditProductPage />
      </Router>
    );
  };

  test("renders all fields", () => {
    (Agent.Brand.list as jest.Mock).mockResolvedValue({
      data: [
        {
          id: 1,
          brand_name: "Royal",
        },
        {
          id: 2,
          brand_name: "StreetDogs",
        },
      ],
    });
    renderComponent();
    expect(screen.getByText(/Editar producto/i)).toBeInTheDocument();
    expect(screen.getByText(/Código/i)).toBeInTheDocument();
    expect(screen.getByText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByText(/Precio/i)).toBeInTheDocument();
    expect(screen.getByText(/Stock/i)).toBeInTheDocument();
    expect(screen.getByText(/Categoría/i)).toBeInTheDocument();
    expect(screen.getByText(/Marca/i)).toBeInTheDocument();
    expect(screen.getByText(/Especie/i)).toBeInTheDocument();
  });

  test("renders all buttons", () => {
    (Agent.Brand.list as jest.Mock).mockResolvedValue({
      data: [
        {
          id: 1,
          brand_name: "Royal",
        },
        {
          id: 2,
          brand_name: "StreetDogs",
        },
      ],
    });
    renderComponent();
    expect(screen.getAllByText(/Editar/i)[1]).toBeInTheDocument();
    expect(screen.getByText(/Cancelar/i)).toBeInTheDocument();
  });

  test("redirects on successful edit", async () => {
    (Agent.Brand.list as jest.Mock).mockResolvedValue({
      data: [
        {
          id: 1,
          brand_name: "Royal",
        },
        {
          id: 2,
          brand_name: "StreetDogs",
        },
      ],
    });
    (Agent.Product.add as jest.Mock).mockResolvedValue({
      data: {
        unique_id: "12345678",
        product_name: "Carne",
        stock: "20",
        price: "2500",
        categoryName: "Alimento",
        brandName: "Royal",
        specieName: "Perro",
      },
    });

    renderComponent();

    const idInput = screen.getByPlaceholderText(/Código del producto/i);
    const nameInput = screen.getByPlaceholderText(/Nombre del producto/i);
    const priceInput = screen.getByPlaceholderText(/Precio/i);
    const stockInput = screen.getByPlaceholderText(/Stock/i);
    const categoryInput = screen.getAllByText(/SIN ELECCIÓN/i)[0];
    const brandInput = screen.getAllByText(/SIN ELECCIÓN/i)[1];
    const specieInput = screen.getAllByText(/SIN ELECCIÓN/i)[2];

    const editButton = screen.getAllByText(/Editar/i)[1];

    fireEvent.change(idInput, {
      target: { value: "12345678" },
    });
    fireEvent.change(nameInput, {
      target: { value: "Carne" },
    });
    fireEvent.change(priceInput, {
      target: { value: "2500" },
    });
    fireEvent.change(stockInput, {
      target: { value: "20" },
    });
    fireEvent.change(categoryInput, {
      target: { value: "Alimento" },
    });
    fireEvent.change(brandInput, {
      target: { value: "Royal" },
    });
    fireEvent.change(specieInput, {
      target: { value: "Perro" },
    });

    fireEvent.click(editButton);

    const editButton2 = screen.getAllByText(/Editar/i)[1];

    fireEvent.click(editButton2);
  });
});
