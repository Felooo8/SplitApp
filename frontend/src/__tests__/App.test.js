import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { rest } from "msw";
import { setupServer } from "msw/node";
import Constants from "../apis/Constants";

const server = setupServer(
  rest.post(Constants.SERVER + "/api-token-auth/", (req, res, ctx) => {
    // respond using a mocked JSON body
    return res(ctx.status(200), ctx.json({ token: "validToken" }));
  }),
  rest.get(Constants.SERVER + "/api/auth/users/me/", (req, res, ctx) => {
    // respond using a mocked JSON body
    return res(ctx.status(200), ctx.json({ username: "someUserName" }));
  }),
  rest.get(Constants.SERVER + "/api/getNotifications", (req, res, ctx) => {
    // respond using a mocked JSON body
    return res(ctx.status(400), ctx.json({}));
  })
);

describe("SignIn component", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
      writable: true,
    });
  });

  it("Should call localStorage getItem on render", () => {
    render(<App />);
    expect(window.localStorage.getItem).toHaveBeenCalledTimes(4);
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(0);
  });

  it("Not logged in - redirect", () => {
    render(<App />);
    const typography = screen.getByText("Sign in");
    expect(typography).toBeInTheDocument();

    //   const typographyBad = screen.queryByText("Not in document");
    //   expect(typographyBad).toBeNull();
  });

  it("Entering data", () => {
    render(<App />);

    const usernameField = screen.getByRole("textbox", { name: /Username/ });
    expect(usernameField).toBeInTheDocument();
    expect(usernameField).toHaveValue("");

    const passwordField = screen.getByLabelText(/Password/);
    expect(passwordField).toBeInTheDocument();
    expect(usernameField).toHaveValue("");

    const submitButton = screen.getByRole("button", { name: /Sign In/ });
    expect(submitButton).toBeDisabled();

    let setUsername = "Some username";
    userEvent.type(usernameField, setUsername);
    expect(usernameField).toHaveValue(setUsername);

    let setPassword = "Some passowrd";
    userEvent.type(passwordField, setPassword);
    expect(passwordField).toHaveValue(setPassword);

    expect(submitButton).toBeEnabled();
  });
  it("Fetch", async () => {
    render(<App />);

    const usernameField = screen.getByRole("textbox", { name: /Username/ });
    const passwordField = screen.getByLabelText(/Password/);
    const submitButton = screen.getByRole("button", { name: /Sign In/ });

    await act(() => {
      userEvent.type(usernameField, "username");
      userEvent.type(passwordField, "password");
      userEvent.click(submitButton);
    });
    // screen.debug();
    // expect(usernameField).toHaveValue("X");
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(2);
    // expect(window.localStorage.setItem).toHaveBeenCalledWith("someUserName");
  });
});
