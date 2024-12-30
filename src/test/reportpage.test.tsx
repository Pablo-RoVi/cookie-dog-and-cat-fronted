import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ReportPage from "../features/report/reportpage";

jest.mock("../app/api/agent");

describe("ReportPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <ReportPage />
      </BrowserRouter>
    );
  };

  test("renders all fields and buttons", () => {
    renderComponent();
  });
});
