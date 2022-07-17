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
