import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "./Footer";

describe("Footer Component", () => {
  test("renders without crashing", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  test("displays the correct footer text", () => {
    render(<Footer />);
    expect(
      screen.getByText("© 2024 URL Shortener. Simplify your links with us.")
    ).toBeInTheDocument();
  });
});
