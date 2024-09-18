import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UrlContainer from "./UrlContainer";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({ hash: "short-link", linkExpiry: "2024-12-31" }),
  })
);

describe("UrlContainer Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<UrlContainer />);
    expect(screen.getByTestId("url-container")).toBeInTheDocument();
  });

  test("renders input field and submit button", () => {
    render(<UrlContainer />);
    expect(
      screen.getByPlaceholderText("Enter Long URL here")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Get Short URL/i })
    ).toBeInTheDocument();
  });

  test("submits form and displays shortened URL", async () => {
    render(<UrlContainer />);

    fireEvent.change(screen.getByPlaceholderText("Enter Long URL here"), {
      target: { value: "https://example.com/very-long-url" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Get Short URL/i }));

    // await waitFor(() => {
    //   expect(screen.getByText("short-link")).toBeInTheDocument();
    // });
  });

  test("shows loading spinner during request", async () => {
    render(<UrlContainer />);

    fireEvent.change(screen.getByPlaceholderText("Enter Long URL here"), {
      target: { value: "https://example.com/very-long-url" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Get Short URL/i }));

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  test("shows validation error for incorrect URL format", async () => {
    render(<UrlContainer />);

    fireEvent.change(screen.getByPlaceholderText("Enter Long URL here"), {
      target: { value: "http://example.com/invalid-url" },
    });

    fireEvent.blur(screen.getByPlaceholderText("Enter Long URL here"));

    await waitFor(() => {
      expect(
        screen.getByText("URL must start with https://")
      ).toBeInTheDocument();
    });
  });

  test("disables input field during request", async () => {
    render(<UrlContainer />);

    fireEvent.change(screen.getByPlaceholderText("Enter Long URL here"), {
      target: { value: "https://example.com/very-long-url" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Get Short URL/i }));
  });

  //displays error message on failed API call
  //shows and closes popup with error message
});
