import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserPage from "../features/user/userpage";

jest.mock("../app/api/agent");

describe("UserPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <UserPage />
      </BrowserRouter>
    );
  };

  test("renders all fields and buttons", () => {
    renderComponent();
  });
});
