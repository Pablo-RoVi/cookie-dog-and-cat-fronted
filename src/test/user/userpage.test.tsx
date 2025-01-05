import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UserPage from "../../features/user/userpage";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../app/api/agent", () => ({
  User: {
    list: jest.fn().mockResolvedValue({}),
  },
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

  test("renders all fields", () => {
    renderComponent();

    expect(screen.getByText(/Empleados/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Nombre/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Rol/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Estado de la Cuenta/i)).toBeInTheDocument();
    expect(screen.getByText(/Código/i)).toBeInTheDocument();
    expect(screen.getByText(/RUT/i)).toBeInTheDocument();
    expect(screen.getByText(/Apellido/i)).toBeInTheDocument();
    expect(screen.getByText(/Nombre de Usuario/i)).toBeInTheDocument();
  });

  test("renders all buttons", () => {
    renderComponent();
    expect(screen.getAllByText(/SIN ELECCIÓN/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Añadir/i)).toBeInTheDocument();
  });
});
