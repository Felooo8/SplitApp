import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Constants from "../apis/Constants";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        SplitApp
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {
  const [ifValidData, setIfValidData] = useState<boolean>(true);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [userNameError, setUserNameError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("Invalid data!");
  const [firstName, setFirstName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  function ValidData() {
    if (!ifValidData) {
      return <p style={{ color: "red" }}>{errorText}</p>;
    }
    return <div></div>;
  }

  function validateForm() {
    return (
      userName.length > 0 &&
      firstName.length > 0 &&
      lastName.length > 0 &&
      email.length > 0 &&
      password.length > 0
    );
  }

  const handleLogin = () => {
    fetch(Constants.SERVER + "/api/auth/users/me/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data) => {
              localStorage.setItem("UserName", data.username);
            })
            .then(() => navigate("/"));
        } else {
          throw Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      });
  };

  const logIn = (
    username: FormDataEntryValue | null,
    password: FormDataEntryValue | null
  ) => {
    const getToken = () => {
      let url = Constants.SERVER + "/api-token-auth/";
      let login_data = {
        password: password,
        username: username,
      };
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login_data),
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              console.log(data);
              localStorage.setItem("token", data.token);
              handleLogin();
              setError(false);
            });
          } else {
            throw Error("Something went wrong");
          }
        })
        .catch((error) => {
          console.log(error);
          setIfValidData(false);
        });
    };
    getToken();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let register_data = {
      userName: data.get("userName"),
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
    };
    const getToken = () => {
      let url = Constants.SERVER + "/api/sign-up";
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(register_data),
      })
        .then((response) => {
          if (response.ok) {
            logIn(register_data.userName, register_data.password);
            setError(false);
          } else {
            response
              .json()
              .then((data) => {
                if (data.bad_email) {
                  setErrorText("Bad email format");
                  setEmailError(true);
                  setUserNameError(false);
                } else if (data.email_exists) {
                  setErrorText("Email already exists");
                  setEmailError(true);
                  setUserNameError(false);
                } else if (data.username_exists) {
                  setErrorText("Username already exists");
                  setEmailError(false);
                  setUserNameError(true);
                }
                throw Error("Something went wrong");
              })
              .catch((error) => {
                console.log(error);
                setIfValidData(false);
              });
          }
        })
        .catch((error) => {
          console.log(error);
          setIfValidData(false);
          setErrorText("Check your connection");
        });
    };
    getToken();
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="userName"
                  label="Username"
                  name="userName"
                  autoComplete="userName"
                  error={userNameError}
                  onChange={(e) =>
                    setUserName(
                      (e.currentTarget.value = e.currentTarget.value.replace(
                        /\s/g,
                        ""
                      ))
                    )
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={emailError}
                  onChange={(e) =>
                    setEmail(
                      (e.currentTarget.value = e.currentTarget.value.replace(
                        /\s/g,
                        ""
                      ))
                    )
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!validateForm()}
            >
              Sign Up
            </Button>
            <ValidData></ValidData>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
