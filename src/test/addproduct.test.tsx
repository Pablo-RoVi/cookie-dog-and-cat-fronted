import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AddProductPage from "../features/product/addproductpage";
import Agent from "../app/api/agent";

jest.mock("../app/api/agent");

describe("AddProductPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all fields and buttons", () => {
    render(
      <BrowserRouter>
        <AddProductPage />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText("Código del producto")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nombre del producto")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Precio")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Stock")).toBeInTheDocument();

    expect(screen.getByText("Añadir")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  test("shows error messages for invalid inputs", () => {
    render(
      <BrowserRouter>
        <AddProductPage />
      </BrowserRouter>
    );

    const inputCode = screen.getByPlaceholderText("Código del producto");
    fireEvent.change(inputCode, { target: { value: "abc" } });

    expect(
      screen.getByText("El código debe ser numérico y de 8 a 15 dígitos")
    ).toBeInTheDocument();
  });

  test("submits the form successfully when valid", async () => {
    (Agent.Product.add as jest.Mock).mockResolvedValue({ status: 204 });

    render(
      <BrowserRouter>
        <AddProductPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Código del producto"), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nombre del producto"), {
      target: { value: "Producto 1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Precio"), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByPlaceholderText("Stock"), {
      target: { value: "10" },
    });

    fireEvent.change(screen.getByLabelText("Categoría"), {
      target: { value: "Categoría 1" },
    });
    fireEvent.change(screen.getByLabelText("Marca"), {
      target: { value: "Marca 1" },
    });
    fireEvent.change(screen.getByLabelText("Especie"), {
      target: { value: "Especie 1" },
    });

    const addButton = screen.getByText("Añadir");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(Agent.Product.add).toHaveBeenCalledWith({
        unique_id: "12345678",
        product_name: "Producto 1",
        price: "1000",
        stock: "10",
        categoryName: "Categoría 1",
        brandName: "Marca 1",
        specieName: "Especie 1",
      });
    });

    expect(
      screen.getByText("Producto 'Producto 1' agregado con éxito")
    ).toBeInTheDocument();
  });

  test("handles API error gracefully", async () => {
    // Mockear error de API
    (Agent.Product.add as jest.Mock).mockRejectedValue({
      response: { data: { errors: { productName: ["Nombre inválido"] } } },
    });

    render(
      <BrowserRouter>
        <AddProductPage />
      </BrowserRouter>
    );

    // Llenar campos y enviar el formulario
    fireEvent.change(screen.getByPlaceholderText("Código del producto"), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nombre del producto"), {
      target: { value: "Invalid Name" },
    });

    const addButton = screen.getByText("Añadir");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByText("Corrija los siguientes errores:\n productName: Nombre inválido")
      ).toBeInTheDocument();
    });
  });
});
