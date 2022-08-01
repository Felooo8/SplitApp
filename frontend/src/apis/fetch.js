export const getGroups = () => {
  fetch("http://127.0.0.1:8000/api/group", {
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

export const postSetAsPaid = (id, isPaid) => {
  fetch("http://127.0.0.1:8000/api/setAsPaid", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ id: id, paid: isPaid }),
  }).then((response) => {
    if (response.ok) {
      console.log("Set as paid successfully");
    } else {
      console.log("Not set as paid");
      throw new Error("Something went wrong");
    }
  });
};

export const postSettled = (id, settled) => {
  fetch("http://127.0.0.1:8000/api/settle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ id: id, settled: settled }),
  }).then((response) => {
    if (response.ok) {
      console.log("Settled successfully");
    } else {
      console.log("Not settled");
      throw new Error("Something went wrong");
    }
  });
};
