import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { InputField } from "../InputField";

test("renders label and updates value via onChange", () => {
  const onChange = jest.fn();
  render(<InputField label="Name" placeholder="type…" onChange={onChange} />);
  expect(screen.getByLabelText("Name")).toBeInTheDocument();

  const input = screen.getByPlaceholderText("type…");
  fireEvent.change(input, { target: { value: "Alice" } });
  expect(onChange).toHaveBeenCalled();
});

test("shows error when invalid with errorMessage", () => {
  render(
    <InputField
      label="Email"
      onChange={() => {}}
      invalid
      errorMessage="Required"
    />
  );
  expect(screen.getByText("Required")).toBeInTheDocument();
});
