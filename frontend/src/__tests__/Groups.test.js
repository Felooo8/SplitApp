import { render, screen, waitFor } from "@testing-library/react";
import Groups from "../screens/Groups";
import SummaryItem from "../components/SummaryItem";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { rest } from "msw";
import { setupServer } from "msw/node";
import Constants from "../apis/Constants";
import { MemoryRouter } from "react-router-dom";

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
  rest.get(
    Constants.SERVER + "/api/getGroupAvatar/:groupID",
    (req, res, ctx) => {
      // respond using a mocked JSON body
      return res(ctx.json({}));
    }
  ),
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
  });

  it("Fetch", async () => {
    const { container } = render(<Groups />, { wrapper: MemoryRouter });
    await waitFor(() =>
      expect(
        screen.getByRole(
          "heading",
          { level: 5 },
          { description: "Your groups:" }
        )
      ).toBeInTheDocument()
    );

    expect(await screen.findByText(firstGroupName)).toBeInTheDocument();
    expect(await screen.findByText(secondGroupName)).toBeInTheDocument();

    expect((await screen.findByText(/owes you/)).parentElement).toHaveStyle(
      `color: green`
    );
    expect((await screen.findByText(/you owe/)).parentElement).toHaveStyle(
      `color: orange`
    );

    expect(
      (await screen.findByText("$" + Math.abs(firstBalance))).parentElement
    ).toHaveStyle(`color: orange`);
    expect(
      (await screen.findByText("$" + Math.abs(secondBalance))).parentElement
    ).toHaveStyle(`color: green`);

    // check if there are tu summary components
    const boxes = container.getElementsByClassName("MuiPaper-elevation5");
    expect(boxes).toHaveLength(2);
    expect(boxes.item(0).querySelector("span").innerHTML == firstGroupName);
    expect(boxes.item(1).querySelector("span").innerHTML == secondGroupName);
  });

  it("Are links correct", async () => {
    const { container } = render(<Groups />, { wrapper: MemoryRouter });
    await waitFor(() =>
      expect(
        screen.getByRole(
          "heading",
          { level: 5 },
          { description: "Your groups:" }
        )
      ).toBeInTheDocument()
    );

    const iconButton1 = screen.getByRole("link", {
      name: new RegExp(firstGroupName),
      exact: false,
    });
    expect(iconButton1).toHaveAttribute(
      "href",
      "/mygroup/" + firstGroupID + "/" + firstGroupName
    );

    const iconButton2 = screen.getByRole("link", {
      name: new RegExp(secondGroupName),
      exact: false,
    });
    expect(iconButton2).toHaveAttribute(
      "href",
      "/mygroup/" + secondGroupID + "/" + secondGroupName
    );

    expect(
      screen.getAllByRole("link", {
        name: /owe/,
      })
    ).toHaveLength(2);
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
