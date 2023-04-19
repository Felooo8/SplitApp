import Constants from "../apis/Constants";

export const getGroups = () => {
  fetch(Constants.SERVER + "/api/group", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data[0];
    });
};

export const postSetAsPaid = async (
  id,
  isPaid,
  isGroupExpense = false,
  errorToggle = null
) => {
  return fetch(Constants.SERVER + "/api/setAsPaid", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      id: id,
      paid: isPaid,
      isGroupExpense: isGroupExpense,
    }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Set as paid successfully");
        return true;
      } else {
        throw Error("Something went wrong");
      }
    })
    .catch((error) => {
      console.log(error);
      console.log("Not set as paid");
      errorToggle();
      return false;
    });
};

export const postSettled = async (
  id,
  settled,
  isGroupExpense = false,
  errorToggle = null
) => {
  return fetch(Constants.SERVER + "/api/settle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      id: id,
      settled: settled,
      isGroupExpense: isGroupExpense,
    }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Settled successfully");
        return true;
      } else {
        throw Error("Something went wrong");
      }
    })
    .catch((error) => {
      console.log(error);
      console.log("Not settled");
      errorToggle();
      return false;
    });
};
