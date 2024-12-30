import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EditProductPage from "../features/product/editproductpage";

jest.mock("../app/api/agent");

describe("EditProductPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <EditProductPage />
      </BrowserRouter>
    );
  };

  test("renders all fields and buttons", () => {
    renderComponent();
  });
});
