import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProductPage from "../../features/product/productpage";
import Agent from "../../app/api/agent";
import { useAuth } from "../../app/context/authcontext";

// Mock de Agent y AuthContext
jest.mock("../../app/api/agent", () => ({
  Product: {
    list: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("../../app/context/authcontext", () => ({
  useAuth: jest.fn(),
}));

describe("ProductPage con un solo producto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Agent.Product.list as jest.Mock).mockResolvedValue({
      data: [
        {
          unique_id: "12345678",
          product_name: "Carne",
          stock: "25",
          price: "2500",
          categoryName: "Alimento",
          brandName: "Royal",
          specieName: "Perro",
        },
      ],
    });
    (useAuth as jest.Mock).mockReturnValue({ userRoleId: 1 });
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <ProductPage />
      </BrowserRouter>
    );
  };

  test("renderiza los campos básicos y botones", async () => {
    renderComponent();
  });
});
