import Constants from "./Constants";

export const logout = () => {
  let url = "http://127.0.0.1:8000/api-token-logout/";
  // let csrftoken = getCookie("csrftoken");
  fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  }).then((response) => {
    if (response.ok) {
      localStorage.clear();
      console.log("logout successful");
      // localStorage.removeItem("UserName");
    } else {
      console.log("invalid data");
    }
  });
};

export const handleLogin = () => {
  return fetch(Constants.SERVER + "/api/auth/users/me/", {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          localStorage.setItem("UserName", data.username);
          console.log(data);
          return data;
        });
      } else {
        throw Error("Something went wrong");
      }
    })
    .catch((error) => {
      console.log(error);
      return {};
    });
};

// function getCookie(name) {
//   var cookieValue = null;
//   if (document.cookie && document.cookie !== "") {
//     var cookies = document.cookie.split(";");
//     for (var i = 0; i < cookies.length; i++) {
//       var cookie = cookies[i].trim();
//       if (cookie.substring(0, name.length + 1) === name + "=") {
//         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//         break;
//       }
//     }
//   }
//   return cookieValue;
// }
