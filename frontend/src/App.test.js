import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders sign in page - not logged in", () => {
  render(<App />);
  screen.debug();
  const typography = screen.getByText("Sign in");
  expect(typography).toBeInTheDocument();

  const usernameField = screen.getByRole("textbox", { name: /username/i });
  expect(usernameField).toBeInTheDocument();
  expect(usernameField).toHaveValue("");
  const passwordField = screen.getByLabelText(/Password/i);
  expect(passwordField).toBeInTheDocument();
  expect(usernameField).toHaveValue("");

  let setUsername = "Some username";
  fireEvent.change(usernameField, {
    target: { value: setUsername },
  });
  expect(usernameField).toHaveValue(setUsername);

  let setPassword = "Some passowrd";
  fireEvent.change(passwordField, {
    target: { value: setPassword },
  });
  expect(passwordField).toHaveValue(setPassword);

  //   const typographyBad = screen.queryByText("Not in document");
  //   expect(typographyBad).toBeNull();
});
