import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./Home";

describe("Home Component", () => {
  test("renders UrlContainer component", () => {
    render(<Home />);

    // Assert that UrlContainer component is rendered
    const urlContainerElement = screen.getByTestId("url-container");
    expect(urlContainerElement).toBeInTheDocument();
  });
});
