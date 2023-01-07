import { render, screen, waitFor } from "@testing-library/react";
import Groups from "../screens/Groups";
import GroupItem from "../components/GroupItem";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { rest } from "msw";
import { setupServer } from "msw/node";
import Constants from "../apis/Constants";

const firstGroupID = 1;
const firstGroupName = "First group";
const firstBalance = -200.5;
const secondGroupID = 2;
const secondGroupName = "Second group";
const secondBalance = 50;

const server = setupServer(
  rest.get(Constants.SERVER + "/api/groups", (req, res, ctx) => {
    // respond using a mocked JSON body
    // {username : [debt, userId]}
    return res(
      ctx.json([
        {
          id: firstGroupID,
          group_name: firstGroupName,
          balance: firstBalance,
        },
        {
          id: secondGroupID,
          group_name: secondGroupName,
          balance: secondBalance,
        },
      ])
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

describe("Groups component", () => {
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
    render(<Groups />);
    server.use(
      // Runtime request handler override for the "GET /api/summarize".
      rest.get(Constants.SERVER + "/api/groups", (req, res, ctx) => {
        return res(ctx.json([]));
      })
    );
    expect(
      await screen.findByText(/You are currenly not in any group/)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/When you join one, it'll show up here/)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Refresh/ })).toBeInTheDocument();
    screen.debug();
  });

  it("BottomAppBar", async () => {
    const selectedColor = `color: rgb(25 118 210)`;
    const notSelectedColor = `color: rgb(0, 0, 0, 0.6)`;
    render(<Groups />);
    const homeIcon = screen.getByTestId("HomeIcon");
    await waitFor(() => expect(homeIcon).toBeInTheDocument());
    expect(homeIcon).toHaveStyle(selectedColor);
    const groupsIcon = screen.getByTestId("GroupsIcon");
    expect(groupsIcon).toBeInTheDocument();
    expect(groupsIcon).toHaveStyle(selectedColor);
    const paymentsIcon = screen.getByTestId("PaymentsIcon");
    expect(paymentsIcon).toBeInTheDocument();
    expect(paymentsIcon).toHaveStyle(notSelectedColor);
    const addCardIcon = screen.getByTestId("AddCardIcon");
    expect(addCardIcon).toBeInTheDocument();
    expect(addCardIcon).toHaveStyle(notSelectedColor);
    const mailIcon = screen.getByTestId("MailIcon");
    expect(mailIcon).toBeInTheDocument();
    expect(mailIcon).toHaveStyle(notSelectedColor);
    const addIcon = screen.getByTestId("AddIcon");
    expect(addIcon).toBeInTheDocument();
    expect(addIcon).toHaveStyle(`color: rgb(255 255 255)`);
  });
});
