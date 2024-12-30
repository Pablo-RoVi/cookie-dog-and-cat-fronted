import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EditSalePage from "../features/sale/editsalepage";

jest.mock("../app/api/agent");

describe("EditSalePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <EditSalePage />
      </BrowserRouter>
    );
  };

  test("renders all fields and buttons", () => {
    renderComponent();
  });
});
