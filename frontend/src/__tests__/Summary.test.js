import { render, screen, fireEvent } from "@testing-library/react";
import Summary from "../screens/Summary";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { rest } from "msw";
import { setupServer } from "msw/node";
import Constants from "../apis/Constants";

const firstUsername = "Andrew";
const firstUserID = 1;
const firstUserDebt = 200;
const secondUsername = "Tristan";
const secondUserID = 2;
const secondUserDebt = -300;

const server = setupServer(
  rest.get(Constants.SERVER + "/api/summarize", (req, res, ctx) => {
    // respond using a mocked JSON body
    // {username : [debt, userId]}
    return res(
      ctx.json({
        [firstUsername]: [firstUserDebt, firstUserID],
        [secondUsername]: [secondUserDebt, secondUserID],
      })
    );
  }),
  rest.get(Constants.SERVER + "/api/getAvatar/:userID", (req, res, ctx) => {
    // respond using a mocked JSON body
    return res(ctx.json({}));
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

  it("Empty data", async () => {
    render(<Summary />);
    server.use(
      // Runtime request handler override for the "GET /api/summarize".
      rest.get(Constants.SERVER + "/api/summarize", (req, res, ctx) => {
        return res(ctx.json({}));
      })
    );
    expect(await screen.findByText(/You have no debts!/)).toBeInTheDocument();
    expect(await screen.findByText(/No debts yet/)).toBeInTheDocument();
    expect(
      await screen.findByText(/When you get one, it'll show up here/)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Refresh/ })).toBeInTheDocument();
  });
  it("Fetch", async () => {
    const { container } = render(<Summary />);
    let total = Math.abs(firstUserDebt + secondUserDebt).toFixed(2);
    expect(
      await screen.findByText("Overall, people owe you $" + total)
    ).toBeInTheDocument();

    // check if there are tu summary components
    const boxes = container.getElementsByClassName("MuiPaper-elevation5");
    expect(boxes).toHaveLength(2);
    expect(boxes.item(0).querySelector("span").innerHTML == firstUsername);
    expect(boxes.item(1).querySelector("span").innerHTML == secondUsername);
    screen.debug();
  });
  it("Not logged in - redirect", () => {
    render(<Summary />);
  });

  it("Entering data", () => {
    render(<Summary />);
  });
});
