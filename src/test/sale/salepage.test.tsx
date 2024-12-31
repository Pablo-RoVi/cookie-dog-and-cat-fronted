import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SalePage from "../../features/sale/salepage";

jest.mock("../../app/api/agent");

describe("SalePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <SalePage />
      </BrowserRouter>
    );
  };

  test("renders all fields and buttons", () => {
    renderComponent();
  });
});
