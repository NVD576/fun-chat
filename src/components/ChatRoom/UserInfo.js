import React from "react";
import { Button, Avatar, Typography } from "antd";
import styled from "styled-components";

import { AuthContext } from "../../Context/AuthProvider";
import { AppContext } from "../../Context/AppProvider";
import { useHistory } from "react-router-dom";

const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(82, 38, 83);

  .username {
    color: orange;
    margin-left: 5px;
  }
`;

export default function UserInfo() {
  const history = useHistory();
  const {
    user: { username, avatar },
  } = React.useContext(AuthContext);
  const { setUser, setIsLogin, setRe } = React.useContext(AuthContext);
  const { clearState } = React.useContext(AppContext);
  const signOut = () => {
    setUser({});
    setIsLogin(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isLogin");
    setRe(false);
    history.push("/login");
  };
  return (
    <WrapperStyled>
      <div>
        <Avatar src={avatar}>{avatar}</Avatar>
        <Typography.Text className="username">{username} </Typography.Text>
      </div>
      <Button
        ghost
        onClick={() => {
          // clear state in App Provider when logout

          clearState();
          signOut();
        }}
      >
        Đăng xuất
      </Button>
    </WrapperStyled>
  );
}
