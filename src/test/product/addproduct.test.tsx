import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AddProductPage from "../../features/product/addproductpage";
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

describe("AddProductPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <Router>
        <AddProductPage />
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
    expect(screen.getByText(/Añadir producto/i)).toBeInTheDocument();
    expect(screen.getByText(/Añadir marca/i)).toBeInTheDocument();
    expect(screen.getByText(/Código/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Nombre/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Nombre/i)[1]).toBeInTheDocument();
    expect(screen.getByText(/Precio/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Stock/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Categoría/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Marca/i)[0]).toBeInTheDocument();
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
    expect(
      screen.getByPlaceholderText(/Código del producto/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Nombre del producto/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Precio/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Stock/i)).toBeInTheDocument();
    expect(screen.getAllByText(/SIN ELECCIÓN/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/SIN ELECCIÓN/i)[1]).toBeInTheDocument();
    expect(screen.getAllByText(/SIN ELECCIÓN/i)[2]).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Nombre de la marca/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText(/Añadir/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Añadir/i)[1]).toBeInTheDocument();
    expect(screen.getAllByText(/Añadir/i)[2]).toBeInTheDocument();
    expect(screen.getAllByText(/Añadir/i)[3]).toBeInTheDocument();
    expect(screen.getAllByText(/Cancelar/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Cancelar/i)[1]).toBeInTheDocument();
  });

  test("redirects on successful add product", async () => {
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
        unique_id: "12345665432",
        product_name: "Galleta",
        stock: "20",
        price: "2500",
        categoryName: "Alimento",
        brandName: "Royal",
        specieName: "Perro",
      },
    });

    renderComponent();

    const codeInput = screen.getByPlaceholderText(/Código del producto/i);
    const nameInput = screen.getByPlaceholderText(/Nombre del producto/i);
    const priceInput = screen.getByPlaceholderText(/Precio/i);
    const stockInput = screen.getByPlaceholderText(/Stock/i);
    const categoryInput = screen.getAllByText(/SIN ELECCIÓN/i)[0];
    const brandInput = screen.getAllByText(/SIN ELECCIÓN/i)[1];
    const specieInput = screen.getAllByText(/SIN ELECCIÓN/i)[2];

    const addButton = screen.getAllByText(/Añadir/i)[0];

    fireEvent.change(codeInput, {
      target: { value: "12345665432" },
    });
    fireEvent.change(nameInput, {
      target: { value: "Galleta" },
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

    await fireEvent.click(addButton);

    const addButton2 = screen.getAllByText(/Añadir/i)[1];

    await fireEvent.click(addButton2);
  });

  test("redirects on successful add brand", async () => {
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
    (Agent.Brand.add as jest.Mock).mockResolvedValue({
      data: {
        brand_name: "Royal",
      },
    });
    renderComponent();

    const brandInput = screen.getByPlaceholderText(/Nombre de la marca/i);

    const addButton = screen.getAllByText(/Añadir/i)[3];

    fireEvent.change(brandInput, {
      target: { value: "Royal" },
    });

    await fireEvent.click(addButton);
  });

  test("shows error when product already exists", async () => {
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
    (Agent.Product.add as jest.Mock).mockRejectedValue(
      new Error("Producto ya en la base de datos.")
    );
    renderComponent();

    const codeInput = screen.getByPlaceholderText(/Código del producto/i);
    const nameInput = screen.getByPlaceholderText(/Nombre del producto/i);
    const priceInput = screen.getByPlaceholderText(/Precio/i);
    const stockInput = screen.getByPlaceholderText(/Stock/i);
    const categoryInput = screen.getAllByText(/SIN ELECCIÓN/i)[0];
    const brandInput = screen.getAllByText(/SIN ELECCIÓN/i)[1];
    const specieInput = screen.getAllByText(/SIN ELECCIÓN/i)[2];

    const addButton = screen.getAllByText(/Añadir/i)[0];

    fireEvent.change(codeInput, {
      target: { value: "12345665432" },
    });
    fireEvent.change(nameInput, {
      target: { value: "Galleta" },
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

    await fireEvent.click(addButton);

    const addButton2 = screen.getAllByText(/Añadir/i)[1];

    await fireEvent.click(addButton2);
  });

    test("shows error when brand already exists", async () => {
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
        (Agent.Brand.add as jest.Mock).mockRejectedValue(
        new Error("Marca ya en la base de datos.")
        );
        renderComponent();
    
        const brandInput = screen.getByPlaceholderText(/Nombre de la marca/i);
    
        const addButton = screen.getAllByText(/Añadir/i)[3];
    
        fireEvent.change(brandInput, {
        target: { value: "Royal" },
        });
    
        await fireEvent.click(addButton);
    });
});
