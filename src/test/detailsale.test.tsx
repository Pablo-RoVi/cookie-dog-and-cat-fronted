import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DetailSalePage from "../features/sale/detailsalepage";

jest.mock("../app/api/agent");

describe("DetailProductPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <DetailSalePage />
      </BrowserRouter>
    );
  };

  test("renders all fields and buttons", () => {
    renderComponent();
  });
});
