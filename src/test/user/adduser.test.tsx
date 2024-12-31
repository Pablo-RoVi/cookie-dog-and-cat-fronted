import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AddUserPage from "../../features/user/adduserpage";
import Agent from "../../app/api/agent";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../app/api/agent", () => ({
  User: {
    add: jest.fn(),
  },
}));

describe("UserPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <Router>
        <AddUserPage />
      </Router>
    );
  };

  test("renders all fields", () => {
    renderComponent();
    expect(screen.getByText(/Registrar nuevo empleado/i)).toBeInTheDocument();
    expect(screen.getByText(/Nombres/i)).toBeInTheDocument();
    expect(screen.getByText(/Apellidos/i)).toBeInTheDocument();
    expect(screen.getByText(/RUT/i)).toBeInTheDocument();
    expect(screen.getByText(/Nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByText(/Rol/i)).toBeInTheDocument();
  });

  test("renders all buttons", () => {
    renderComponent();
    expect(screen.getByPlaceholderText(/Ejemplo: Gonzalo Hernán/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ejemplo: González Hernández/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ejemplo: 12345678-9/i)).toBeInTheDocument();
    expect(screen.getByText(/SIN ELECCIÓN/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/Alfanumérica y contener al menos 8 caracteres/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Añadir/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancelar/i)).toBeInTheDocument();
  });

  test("redirects on successful add", async () => {
    (Agent.User.add as jest.Mock).mockResolvedValue({
      data: { nick_name: "GonzaloGonzález", roleId: 2 },
    });

    renderComponent();

    const nameInput = screen.getByPlaceholderText(/Ejemplo: Gonzalo Hernán/i);
    const lastNameInput = screen.getByPlaceholderText(/Ejemplo: González Hernández/i);
    const rutInput = screen.getByPlaceholderText(/Ejemplo: 12345678-9/i);
    const roleInput = screen.getByText(/SIN ELECCIÓN/i);
    const passwordInput = screen.getAllByPlaceholderText(/Alfanumérica y contener al menos 8 caracteres/i)[0];
    const confirmPasswordInput = screen.getAllByPlaceholderText(/Alfanumérica y contener al menos 8 caracteres/i)[1];

    const addButton = screen.getByText(/Añadir/i);

    fireEvent.change(nameInput, {
      target: { value: "Gonzalo" },
    });
    fireEvent.change(lastNameInput, {
      target: { value: "González" },
    });
    fireEvent.change(rutInput, {
      target: { value: "17665318-3" },
    });
    fireEvent.change(roleInput, {
      target: { value: "employee" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "hola1234" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "hola1234" },
    });

    await fireEvent.click(addButton);

  });

  test("shows error when user already exists", async () => {
    (Agent.User.add as jest.Mock).mockRejectedValue(new Error("Usuario ya en la base de datos."));

    renderComponent();

    const nameInput = screen.getByPlaceholderText(/Ejemplo: Gonzalo Hernán/i);
    const lastNameInput = screen.getByPlaceholderText(/Ejemplo: González Hernández/i);
    const rutInput = screen.getByPlaceholderText(/Ejemplo: 12345678-9/i);
    const roleInput = screen.getByText(/SIN ELECCIÓN/i);
    const passwordInput = screen.getAllByPlaceholderText(/Alfanumérica y contener al menos 8 caracteres/i)[0];
    const confirmPasswordInput = screen.getAllByPlaceholderText(/Alfanumérica y contener al menos 8 caracteres/i)[1];

    const addButton = screen.getByText(/Añadir/i);

    fireEvent.change(nameInput, {
      target: { value: "Gonzalo" },
    });
    fireEvent.change(lastNameInput, {
      target: { value: "González" },
    });
    fireEvent.change(rutInput, {
      target: { value: "17665318-3" },
    });
    fireEvent.change(roleInput, {
      target: { value: "employee" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "hola1234" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "hola1234" },
    });

    await fireEvent.click(addButton);
    
  });
});
