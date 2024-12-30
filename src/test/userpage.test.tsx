import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UserPage from "../features/user/userpage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("UserPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <Router>
        <UserPage />
      </Router>
    );
  };

  test("renders all fields and buttons", () => {
    renderComponent();

    expect(screen.getByText(/Empleados/i)).toBeInTheDocument();         
  });
});
