import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AddProductPage from "../features/product/addproductpage";

jest.mock("../app/api/agent");

describe("AddProductPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <AddProductPage />
      </BrowserRouter>
    );
  };

  test("renders all fields and buttons", () => {
    renderComponent();
  });
});
