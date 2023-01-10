import { render, screen, waitFor } from "@testing-library/react";
import AllExpenses from "../screens/AllExpenses";
import SummaryItem from "../components/SummaryItem";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { rest } from "msw";
import { setupServer } from "msw/node";
import Constants from "../apis/Constants";

// borrowed and paid -> orange
const firstExpense = {
  id: 1,
  ower: 1,
  ower_username: "Felo",
  name: "Rent",
  category: "Rent",
  amount: "299.99",
  splitted: false,
  date: "2022-12-08T00:05:25.821309Z",
  short_date: "08 Dec",
  payer: 2,
  payer_username: "Andrew",
  is_paid: true,
  settled: false,
};

// lent and paid -> green and info
const secondExpense = {
  id: 2,
  ower: 2,
  ower_username: "Andrew",
  name: "Food",
  category: "Groceries",
  amount: "30.00",
  splitted: false,
  date: "2022-12-08T00:04:23.112943Z",
  short_date: "03 Mar",
  payer: 1,
  payer_username: "Felo",
  is_paid: true,
  settled: false,
};

// lent and settled -> hidden + yellow bg
const thirdExpense = {
  id: 3,
  ower: 3,
  ower_username: "Elon",
  name: "Hotel",
  category: "Rent",
  amount: "80.00",
  splitted: false,
  date: "2022-12-08T00:04:07.250362Z",
  short_date: "12 Jan",
  payer: 1,
  payer_username: "Felo",
  is_paid: false,
  settled: true,
};

const server = setupServer(
  rest.get(Constants.SERVER + "/api/userExpenses", (req, res, ctx) => {
    // respond using a mocked JSON body
    // {username : [debt, userId]}
    return res(ctx.json([firstExpense, secondExpense, thirdExpense]));
  }),
  rest.get(Constants.SERVER + "/api/auth/users/me/", (req, res, ctx) => {
    // respond using a mocked JSON body
    return res(ctx.json({ id: 1, username: "Felo" }));
  }),
  rest.get(Constants.SERVER + "/api/getNotifications", (req, res, ctx) => {
    // respond using a mocked JSON body
    return res(ctx.status(400), ctx.json({}));
  }),
  rest.post(Constants.SERVER + "/api/settle", (req, res, ctx) => {
    // respond using a mocked JSON body
    return res(ctx.json());
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
    render(<AllExpenses />);
    server.use(
      // Runtime request handler override for the "GET /api/summarize".
      rest.get(Constants.SERVER + "/api/userExpenses", (req, res, ctx) => {
        return res(ctx.json([]));
      })
    );
    await waitFor(() =>
      expect(
        screen.getByRole(
          "heading",
          { level: 5 },
          { description: "No expenses yet" }
        )
      ).toBeInTheDocument()
    );
    expect(
      await screen.findByText(/When you get expenses, they'll show up here/)
    ).toBeInTheDocument();
    expect(
      await screen.getByRole("button", { name: /Refresh/ })
    ).toBeInTheDocument();
  });

  it("Fetch - checks data display", async () => {
    const { container } = render(<AllExpenses />);
    await waitFor(() =>
      expect(
        screen.getByRole(
          "heading",
          { level: 5 },
          { description: "Your expenses:" }
        )
      ).toBeInTheDocument()
    );
    expect(screen.getByRole("radio", { name: /All/ })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Lent/ })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Borrowed/ })).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /Settled/ })
    ).toBeInTheDocument();

    expect((await screen.findByText(/you borrowed/)).parentElement).toHaveStyle(
      `color: orange`
    );
    expect((await screen.findByText(/you lent/)).parentElement).toHaveStyle(
      `color: green`
    );

    expect(
      (await screen.findByText("$" + Math.abs(firstExpense.amount).toFixed(2)))
        .parentElement
    ).toHaveStyle(`color: orange`);
    expect(
      (await screen.findByText("$" + Math.abs(secondExpense.amount).toFixed(2)))
        .parentElement
    ).toHaveStyle(`color: green`);

    // check if there are two AllExpenses components
    const boxes = container.getElementsByClassName("MuiPaper-elevation1");
    expect(boxes).toHaveLength(2);
    expect(
      boxes.item(0).querySelector("span").innerHTML ==
        firstExpense.payer_username
    );
    expect(
      boxes.item(1).querySelector("span").innerHTML ==
        secondExpense.ower_username
    );
    expect(
      boxes.item(1).querySelector("span").innerHTML ==
        secondExpense.ower_username + " has marked as paid"
    );
    // screen.logTestingPlaygroundURL();
  });

  it("Fetch - checks user activity", async () => {
    const { container } = render(<AllExpenses />);
    await waitFor(() =>
      expect(
        screen.getByRole(
          "heading",
          { level: 5 },
          { description: "Your expenses:" }
        )
      ).toBeInTheDocument()
    );
    const boxes = container.getElementsByClassName("MuiPaper-elevation1");
    expect(boxes).toHaveLength(2);

    const SettledFilter = screen.getByRole("checkbox", { name: /Settled/ });
    expect(SettledFilter).toBeEnabled();
    const SettleButton = screen.getByLabelText("Settle");
    console.log(SettleButton.length);

    const ListOfExpenses = container.getElementsByClassName(
      "MuiPaper-elevation1"
    );

    userEvent.click(screen.getByRole("radio", { name: /Lent/ }));
    expect(ListOfExpenses).toHaveLength(1);

    userEvent.click(SettledFilter);
    expect(ListOfExpenses).toHaveLength(2);

    userEvent.click(screen.getByRole("radio", { name: /All/ }));
    expect(ListOfExpenses).toHaveLength(3);

    userEvent.click(SettledFilter);
    expect(ListOfExpenses).toHaveLength(2);

    userEvent.click(SettledFilter);
    expect(ListOfExpenses).toHaveLength(3);
    console.log(SettleButton);
    userEvent.click(SettleButton);
    userEvent.click(SettledFilter);
    expect(ListOfExpenses).toHaveLength(1);
    // screen.debug(undefined, 300000);

    userEvent.click(screen.getByRole("radio", { name: /Borrowed/ }));
    expect(ListOfExpenses).toHaveLength(1);
    expect(SettledFilter).toBeDisabled();
    // ;
  });

  it("Fetch - error", async () => {
    render(<AllExpenses />);
    server.use(
      // Runtime request handler override for the "GET /api/userExpenses".
      rest.get(Constants.SERVER + "/api/userExpenses", (req, res, ctx) => {
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

    expect(
      await screen.findByText(/Brace yourself till we get the error fixed./)
    ).toBeInTheDocument();

    expect(
      await screen.findByText(
        /You may also refresh the page or try again later/
      )
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Refresh" })).toBeInTheDocument();
    // screen.debug();
  });

  it("BottomAppBar", async () => {
    const selectedColor = `color: rgb(25 118 210)`;
    const notSelectedColor = `color: rgb(0, 0, 0, 0.6)`;
    render(<AllExpenses />);
    const homeIcon = screen.getByTestId("HomeIcon");
    await waitFor(() => expect(homeIcon).toBeInTheDocument());
    expect(homeIcon).toHaveStyle(notSelectedColor);
    const groupsIcon = screen.getByTestId("GroupsIcon");
    expect(groupsIcon).toBeInTheDocument();
    expect(groupsIcon).toHaveStyle(notSelectedColor);
    const paymentsIcon = screen.getByTestId("PaymentsIcon");
    expect(paymentsIcon).toBeInTheDocument();
    expect(paymentsIcon).toHaveStyle(selectedColor);
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
