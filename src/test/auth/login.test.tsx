import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "../../app/context/authcontext";
import Login from "../../features/auth/login";
import Agent from "../../app/api/agent";

// Mock para simular el comportamiento de Agent
jest.mock("../../app/api/agent", () => ({
  Auth: {
    login: jest.fn(),
  },
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <AuthProvider>
        <Router>
          <Login />
        </Router>
      </AuthProvider>
    );
  };

  test("renders login form", () => {
    renderComponent();
    expect(screen.getByPlaceholderText("Nombre de usuario")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
    expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ingresar/i })).toBeInTheDocument();
  });

  test("shows error when credentials are incorrect", async () => {
    (Agent.Auth.login as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Nombre de usuario"), {
      target: { value: "wrongUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "wrongPassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    const errorElement = await screen.findByText(/credenciales incorrectas/i);
    expect(errorElement).toBeVisible();
  });

  test("redirects on successful login", async () => {
    (Agent.Auth.login as jest.Mock).mockResolvedValue({
      data: { nick_name: "PRobledo", roleId: 2 },
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Nombre de usuario"), {
      target: { value: "PRobledo" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "paris2024" },
    });

    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(await Agent.Auth.login).toHaveBeenCalledWith({
      Nick_name: "PRobledo",
      Password: "paris2024",
    });

    expect(localStorage.getItem("nickName")).toBe("PRobledo");
    expect(localStorage.getItem("roleId")).toBe("2");
  });

  test("clears error when input is modified", async () => {
    (Agent.Auth.login as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Nombre de usuario"), {
      target: { value: "wrongUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "wrongPassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    const errorElement = await screen.findByText(/credenciales incorrectas/i);
    expect(errorElement).toBeVisible();

    fireEvent.change(screen.getByPlaceholderText("Nombre de usuario"), {
      target: { value: "correctUser" },
    });

    expect(errorElement).not.toBeVisible();
  });
});
