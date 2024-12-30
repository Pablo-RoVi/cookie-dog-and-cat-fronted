import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AddSalePage from "../features/sale/addsalepage";

jest.mock("../app/api/agent");

describe("AddSalePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <AddSalePage />
      </BrowserRouter>
    );
  };

  test("renders all fields and buttons", () => {
    renderComponent();
  });
});
