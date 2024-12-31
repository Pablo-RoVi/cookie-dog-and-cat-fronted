import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import EditUserPage from "../../features/user/edituserpage";
import Agent from "../../app/api/agent";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../app/api/agent", () => ({
  User: {
    update: jest.fn(),
  },
}));

describe("UserPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <Router>
        <EditUserPage />
      </Router>
    );
  };

  test("renders all fields", () => {
    renderComponent();
    expect(screen.getByText(/Editar empleado/i)).toBeInTheDocument();
    expect(screen.getByText(/Código/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Nombre/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Nombre/i)[1]).toBeInTheDocument();
    expect(screen.getAllByText(/Apellido/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Apellido/i)[1]).toBeInTheDocument();
    expect(screen.getByText(/RUT/i)).toBeInTheDocument();
    expect(screen.getByText(/Nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByText(/Rol/i)).toBeInTheDocument();
    expect(screen.getByText(/Editar contraseña/i)).toBeInTheDocument();
    expect(screen.getByText(/Nueva/i)).toBeInTheDocument();
    expect(screen.getByText(/Confirmar/i)).toBeInTheDocument();
  });

  test("renders all buttons", () => {
    renderComponent();
    expect(screen.getByPlaceholderText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Apellido/i)).toBeInTheDocument();
    expect(screen.getByText(/SIN ELECCIÓN/i)).toBeInTheDocument();
    expect(
      screen.getAllByPlaceholderText(
        /Alfanumérica y contener al menos 8 caracteres/i
      )[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByPlaceholderText(
        /Alfanumérica y contener al menos 8 caracteres/i
      )[1]
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Editar/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Editar/i)[1]).toBeInTheDocument();
    expect(screen.getAllByText(/Cancelar/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Cancelar/i)[1]).toBeInTheDocument();
  });

  test("redirects on successful edit", async () => {
    (Agent.User.update as jest.Mock).mockResolvedValue({
      data: { id: 1, name: "Camilo", last_name: "Tessini", role: "employee" },
    });

    renderComponent();

    const nameInput = screen.getByPlaceholderText(/Nombre/i);
    const lastNameInput = screen.getByPlaceholderText(/Apellido/i);
    const roleInput = screen.getByText(/SIN ELECCIÓN/i);

    const editButton = screen.getAllByText(/Editar/i)[0];

    fireEvent.change(nameInput, {
      target: { value: "Camilo" },
    });
    fireEvent.change(lastNameInput, {
      target: { value: "Tessini" },
    });
    fireEvent.change(roleInput, {
      target: { value: "employee" },
    });

    await fireEvent.click(editButton);

    const editButton2 = screen.getAllByText(/Editar/i)[3];

    await fireEvent.click(editButton2);

    const confirmButton = screen.getByText(/Confirmar/i);

    await fireEvent.click(confirmButton);
  });

  test("redirects on successful edit password", async () => {
    (Agent.User.update as jest.Mock).mockResolvedValue({
      data: { id: 1, name: "Camilo", last_name: "Tessini", role: "employee" },
    });

    renderComponent();

    const passwordInput = screen.getAllByPlaceholderText(
      /Alfanumérica y contener al menos 8 caracteres/i
    )[0];
    const confirmPasswordInput = screen.getAllByPlaceholderText(
      /Alfanumérica y contener al menos 8 caracteres/i
    )[1];

    const editButton = screen.getAllByText(/Editar/i)[1];

    fireEvent.change(passwordInput, {
      target: { value: "hola12345" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "hola12345" },
    });

    await fireEvent.click(editButton);

    const editButton2 = screen.getAllByText(/Editar/i)[3];

    await fireEvent.click(editButton2);

    const confirmButton = screen.getByText(/Confirmar/i);

    await fireEvent.click(confirmButton);
  });
});
