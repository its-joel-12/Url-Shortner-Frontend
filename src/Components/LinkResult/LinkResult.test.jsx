import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LinkResult from "./LinkResult";

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe("LinkResult Component", () => {
  const shortenLink = "https://short.url/test123";
  const expiryTime = "2024-12-31";
  const longUrl = "https://example.com/some-really-long-url";
  const domain = "short.url";

  test("renders the long URL", () => {
    render(
      <LinkResult
        shortenLink={shortenLink}
        expiryTime={expiryTime}
        longUrl={longUrl}
        domain={domain}
      />
    );

    const longUrlElement = screen.getByText(longUrl);
    expect(longUrlElement).toBeInTheDocument();
  });

  test("renders the short URL", () => {
    render(
      <LinkResult
        shortenLink={shortenLink}
        expiryTime={expiryTime}
        longUrl={longUrl}
        domain={domain}
      />
    );

    const shortUrlElement = screen.getByText(shortenLink);
    expect(shortUrlElement).toBeInTheDocument();
  });

  test("copies the short URL to clipboard when copy button is clicked", () => {
    render(
      <LinkResult
        shortenLink={shortenLink}
        expiryTime={expiryTime}
        longUrl={longUrl}
        domain={domain}
      />
    );

    const copyButton = screen.getByRole("button", { name: /Copy Short URL/i });
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(shortenLink);
  });

  test("opens the short URL in a new tab when redirect button is clicked", () => {
    global.open = jest.fn();
    render(
      <LinkResult
        shortenLink={shortenLink}
        expiryTime={expiryTime}
        longUrl={longUrl}
        domain={domain}
      />
    );

    const redirectButton = screen.getByRole("button", { name: /Redirect/i });
    fireEvent.click(redirectButton);

    expect(global.open).toHaveBeenCalledWith(shortenLink, "_blank");
  });

  test("shows Snackbar with 'Copied' message when copy button is clicked", async () => {
    render(
      <LinkResult
        shortenLink={shortenLink}
        expiryTime={expiryTime}
        longUrl={longUrl}
        domain={domain}
      />
    );

    const copyButton = screen.getByRole("button", { name: /Copy Short URL/i });
    fireEvent.click(copyButton);

    const snackbarMessage = await screen.findByText(/Copied/i);
    expect(snackbarMessage).toBeInTheDocument();
  });
});
