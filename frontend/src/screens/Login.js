import React, { useState } from "react";
import styled, { css } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";

function LoginScreen(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ifValidData, setIfValidData] = useState(true);
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  function ValidData() {
    if (!ifValidData) {
      return <p style={{ color: "red" }}>Invalid data!</p>;
    }
    return <div></div>;
  }

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  const handleLogin = () => {
    console.log(localStorage.getItem("token"));
    fetch("http://127.0.0.1:8000/api/auth/users/me/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setUser(json.id);
        localStorage.setItem("UserName", json.username);
      })
      .then(() => navigate("/"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let login_data = { password: password, username: username };
    const getToken = () => {
      let url = "http://127.0.0.1:8000/api-token-auth/";
      let csrftoken = getCookie("csrftoken");
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(login_data),
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setIfValidData(true);
            localStorage.setItem("token", data.token);
            handleLogin();
          });
        } else {
          setIfValidData(false);
          console.log("invalid data");
        }
      });
    };
    getToken();
  };

  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  return (
    <Root>
      <Background>
        <Rect>
          <LogoColumn>
            <Logo>
              <EndWrapperFiller></EndWrapperFiller>
              <Text3Column>
                <Text3>Felo</Text3>
                <Rect7></Rect7>
              </Text3Column>
            </Logo>
            <Form onSubmit={handleSubmit} style={formLogin}>
              <UsernameColumn>
                <Username>
                  <UsernameInput
                    // autoFocus
                    // value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    secureTextEntry={false}
                  ></UsernameInput>
                </Username>
                <Password>
                  <PasswordInput
                    type="password"
                    // value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    secureTextEntry={false}
                  ></PasswordInput>
                </Password>
              </UsernameColumn>
              <UsernameColumnFiller></UsernameColumnFiller>
              <Button type="submit" disabled={!validateForm()}>
                <ButtonOverlay>
                  <Text2>Get Started</Text2>
                </ButtonOverlay>
              </Button>
            </Form>
            <ValidData></ValidData>
          </LogoColumn>
          <LogoColumnFiller></LogoColumnFiller>
          <FooterTexts>
            <Link to="/signup">
              <Button2>
                <ButtonOverlay>
                  <CreateAccountFiller></CreateAccountFiller>
                  <CreateAccount>Create Account</CreateAccount>
                </ButtonOverlay>
              </Button2>
            </Link>
            <Button2Filler></Button2Filler>
            <NeedHelp>Need Help?</NeedHelp>
          </FooterTexts>
        </Rect>
      </Background>
    </Root>
  );
}

const formLogin = {
  height: "230px",
  flexDirection: "column",
  display: "flex",
  marginTop: "59px",
};

const Root = styled.div`
  display: flex;
  background-color: rgb(255, 255, 255);
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

const ButtonOverlay = styled.button`
  display: block;
  background: none;
  height: 100%;
  width: 100%;
  border: none;
`;
const Background = styled.div`
  flex-direction: column;
  display: flex;
  flex: 1 1 0%;
`;

const Rect = styled.div`
  background-image: linear-gradient(355deg, #202352 0%, rgb(7 20 45) 100%);
  flex-direction: column;
  display: flex;
  flex: 1 1 0%;
`;

const Logo = styled.div`
  align-items: center;
  width: 102px;
  height: 111px;
  flex-direction: column;
  display: flex;
  align-self: center;
`;

const EndWrapperFiller = styled.div`
  flex: 1 1 0%;
  flex-direction: column;
  display: flex;
`;

const Text3 = styled.span`
  font-family: Arial;
  color: rgba(255, 255, 255, 1);
  font-size: 96px;
  margin-bottom: 4px;
`;

const Rect7 = styled.div`
  height: 8px;
  background-color: #25cdec;
  margin-right: 7px;
`;

const Text3Column = styled.div`
  flex-direction: column;
  margin-bottom: 6px;
  margin-left: 2px;
  margin-right: -4px;
  display: flex;
`;

// const Form = styled.div`
// height: 230px;
// flex-direction: column;
// display: flex;
// margin-top: 59px;
// `;

const Username = styled.div`
  height: 59px;
  background-color: rgba(251, 247, 247, 0.25);
  border-radius: 5px;
  flex-direction: row;
  display: flex;
`;

const UsernameInput = styled.input`
  font-family: Arial;
  height: 30px;
  color: rgba(255, 255, 255, 1);
  flex: 1 1 0%;
  margin-right: 11px;
  margin-left: 11px;
  margin-top: 14px;
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
`;

const Password = styled.div`
  height: 59px;
  background-color: rgba(253, 251, 251, 0.25);
  border-radius: 5px;
  flex-direction: row;
  display: flex;
  margin-top: 27px;
`;

const PasswordInput = styled.input`
  font-family: Arial;
  height: 30px;
  color: rgba(255, 255, 255, 1);
  flex: 1 1 0%;
  margin-right: 17px;
  margin-left: 8px;
  margin-top: 14px;
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
`;

const UsernameColumn = styled.div`
  flex-direction: column;
  display: flex;
`;

const UsernameColumnFiller = styled.div`
  flex: 1 1 0%;
  flex-direction: column;
  display: flex;
`;

const Button = styled.div`
  height: 59px;
  background-color: rgba(31, 178, 204, 1);
  border-radius: 5px;
  flex-direction: column;
  display: flex;
  justify-content: center;
  border: none;
`;

const Text2 = styled.span`
  font-family: Arial;
  color: rgba(255, 255, 255, 1);
  font-weight: 600;
  align-self: center;
`;

const LogoColumn = styled.div`
  flex-direction: column;
  margin-top: 130px;
  margin-left: 41px;
  margin-right: 41px;
  display: flex;
`;

const LogoColumnFiller = styled.div`
  flex: 1 1 0%;
  flex-direction: column;
  display: flex;
`;

const FooterTexts = styled.div`
  height: 14px;
  flex-direction: row;
  display: flex;
  margin-bottom: 36px;
  margin-left: 37px;
  margin-right: 36px;
`;

const Button2 = styled.div`
  width: 104px;
  height: 14px;
  flex-direction: column;
  display: flex;
  align-self: flex-end;
  border: none;
`;

const CreateAccountFiller = styled.div`
  flex: 1 1 0%;
  flex-direction: column;
  display: flex;
`;

const CreateAccount = styled.span`
  font-family: Arial;
  color: rgba(255, 255, 255, 0.5);
`;

const Button2Filler = styled.div`
  flex: 1 1 0%;
  flex-direction: row;
  display: flex;
`;

const NeedHelp = styled.span`
  font-family: Arial;
  color: rgba(255, 255, 255, 0.5);
  align-self: flex-end;
  margin-right: -1px;
`;

export default LoginScreen;
