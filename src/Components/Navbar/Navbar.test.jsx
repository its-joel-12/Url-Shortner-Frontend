import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "./Navbar";

describe("Navbar Component", () => {
  test("renders without crashing", () => {
    render(<Navbar />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  test("displays the correct title", () => {
    render(<Navbar />);
    expect(screen.getByText("YOURL")).toBeInTheDocument();
  });
});
