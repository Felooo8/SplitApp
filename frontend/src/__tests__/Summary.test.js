import { render, screen, waitFor } from "@testing-library/react";
import Summary from "../screens/Summary";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { rest } from "msw";
import { setupServer } from "msw/node";
import Constants from "../apis/Constants";

const firstUsername = "Andrew";
const firstUserID = 1;
const firstUserDebt = -200;
const secondUsername = "Tristan";
const secondUserID = 2;
const secondUserOwning = 300;

const server = setupServer(
  rest.get(Constants.SERVER + "/api/summarize", (req, res, ctx) => {
    // respond using a mocked JSON body
    // {username : [debt, userId]}
    return res(
      ctx.json({
        [firstUsername]: [firstUserDebt, firstUserID],
        [secondUsername]: [secondUserOwning, secondUserID],
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

describe("Summary component", () => {
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
    let total = Math.abs(firstUserDebt + secondUserOwning).toFixed(2);
    // expect(
    //   await screen.findByText("Overall, people owe you $" + total)
    // ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByRole(
          "heading",
          { level: 5 },
          { description: "Overall, people owe you $" + total }
        )
      ).toHaveStyle(`color: green`)
    );

    expect((await screen.findByText(/owes you/)).parentElement).toHaveStyle(
      `color: green`
    );
    expect((await screen.findByText(/you owe/)).parentElement).toHaveStyle(
      `color: orange`
    );

    expect(
      (await screen.findByText("$" + Math.abs(firstUserDebt))).parentElement
    ).toHaveStyle(`color: orange`);
    expect(
      (await screen.findByText("$" + Math.abs(secondUserOwning))).parentElement
    ).toHaveStyle(`color: green`);

    // check if there are tu summary components
    const boxes = container.getElementsByClassName("MuiPaper-elevation5");
    expect(boxes).toHaveLength(2);
    expect(boxes.item(0).querySelector("span").innerHTML == firstUsername);
    expect(boxes.item(1).querySelector("span").innerHTML == secondUsername);
    // screen.logTestingPlaygroundURL();
  });

  it("Fetch - user has debts", async () => {
    render(<Summary />);
    server.use(
      // Runtime request handler override for the "GET /api/summarize".
      rest.get(Constants.SERVER + "/api/summarize", (req, res, ctx) => {
        return res(ctx.json({ [firstUsername]: [firstUserDebt, firstUserID] }));
      })
    );
    await waitFor(() =>
      expect(
        screen.getByRole(
          "heading",
          { level: 5 },
          { description: "Overall, you owe $" + Math.abs(firstUserDebt) }
        )
      ).toHaveStyle(`color: orange`)
    );
  });

  it("Fetch - error", async () => {
    render(<Summary />);
    server.use(
      // Runtime request handler override for the "GET /api/summarize".
      rest.get(Constants.SERVER + "/api/summarize", (req, res, ctx) => {
        return res(ctx.status(400));
      })
    );
    await waitFor(() =>
      expect(
        screen.getByRole(
          "heading",
          { level: 5 },
          { description: "Aaaah! Something went wrong" }
        )
      ).toBeInTheDocument()
    );

    expect(screen.getAllByRole("heading", { level: 6 })).toHaveLength(2);

    expect(screen.getByRole("button", { name: "Refresh" })).toBeInTheDocument();
    // screen.debug();
  });
});
