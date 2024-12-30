import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import NotFound from "../features/error/notfound";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("NotFound Component", () => {
  const renderNotFound = () => {
    render(
      <Router>
        <NotFound />
      </Router>
    );
  };

  test("renders NotFound page correctly", () => {
    renderNotFound();

    expect(screen.getByText(/¡Oops!/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Parece que no encontramos lo que estabas buscando/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Es posible que la página que solicitaste no exista o haya cambiado su ubicación/i
      )
    ).toBeInTheDocument();

    const cookieImage = screen.getByAltText("cookie");
    expect(cookieImage).toBeInTheDocument();
    expect(cookieImage).toHaveClass("opacity-10 grayscale");

    expect(screen.getByRole("button", { name: /volver/i })).toBeInTheDocument();
  });

  test("calls navigate(-1) when 'Volver' button is clicked", () => {
    renderNotFound();

    const backButton = screen.getByRole("button", { name: /volver/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
