import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EditUserPage from "../../features/user/edituserpage";

jest.mock("../../app/api/agent");

describe("EditUserPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <EditUserPage />
      </BrowserRouter>
    );
  };

  test("renders all fields and buttons", () => {
    renderComponent();
  });
});
