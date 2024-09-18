import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Popup from "./Popup";
import "@testing-library/jest-dom";

// Mocking the image imports
jest.mock("../Assets/error-.png", () => "error400");
jest.mock("../Assets/401-Error-.png", () => "error401");
jest.mock("../Assets/server-off-.png", () => "serverOffError"); // Mock server-off-.png

describe("Popup Component", () => {
  test("renders and displays the correct error image for error code 400", () => {
    render(
      <Popup
        openPopup={true}
        setOpenPopup={() => {}}
        resetForm={() => {}}
        errorCode={400}
      />
    );

    const errorImage = screen.getByAltText("error-img");
    expect(errorImage.src).toContain("error400");
  });

  test("renders and displays the correct error image for error code 401", () => {
    render(
      <Popup
        openPopup={true}
        setOpenPopup={() => {}}
        resetForm={() => {}}
        errorCode={401}
      />
    );

    const errorImage = screen.getByAltText("error-img");
    expect(errorImage.src).toContain("error401");
  });

  test("renders the default error image for unknown error codes", () => {
    render(
      <Popup
        openPopup={true}
        setOpenPopup={() => {}}
        resetForm={() => {}}
        errorCode={403}
      />
    );

    const errorImage = screen.getByAltText("error-img");
    expect(errorImage.src).toContain("serverOffError"); // This should now pass
  });

  test("calls resetForm and setOpenPopup when OK button is clicked", () => {
    const resetFormMock = jest.fn();
    const setOpenPopupMock = jest.fn();

    render(
      <Popup
        openPopup={true}
        setOpenPopup={setOpenPopupMock}
        resetForm={resetFormMock}
        errorCode={400}
      />
    );

    fireEvent.click(screen.getByText("OK"));

    expect(resetFormMock).toHaveBeenCalled();
    expect(setOpenPopupMock).toHaveBeenCalledWith(false);
  });

  test("does not close the dialog when clicking outside (backdrop click)", () => {
    const handleCloseMock = jest.fn();

    render(
      <Popup
        openPopup={true}
        setOpenPopup={handleCloseMock}
        resetForm={() => {}}
        errorCode={400}
      />
    );

    fireEvent.click(document.body);

    expect(handleCloseMock).not.toHaveBeenCalled();
  });
});
