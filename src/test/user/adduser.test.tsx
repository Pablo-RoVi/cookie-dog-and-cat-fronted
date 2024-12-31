import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AddUserPage from "../../features/user/adduserpage";

jest.mock("../../app/api/agent");

describe("AddUserPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <AddUserPage />
      </BrowserRouter>
    );
  };

  test("renders all fields and buttons", () => {
    renderComponent();
  });
});
