import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { allUserData } from "../atoms";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  position: absolute;
  width: inherit;
  height: 70px;
  background-color: white;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const ButtonBox = styled.div`
  width: 100px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
`;
const Button = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 15px;
  background-color: ${(props) => props.color};
`;
const UserIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 30px;
  margin-right: 10px;
`;
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 140px;
`;
const Name = styled.div`
  font-size: 20px;
  font-weight: 1000;
`;
const Header = () => {
  const userData = useRecoilValue(allUserData);

  return (
    <Wrapper>
      <ButtonBox>
        <Button color="#FF605C"></Button>
        <Button color="#FFBD44"></Button>
        <Button color="#00CA4E"></Button>
      </ButtonBox>
      {userData.profileUrl ? (
        <Link to={"/openAI/profile"}>
          <UserInfo>
            <Name>{userData.username}</Name>
            <UserIcon src={`${userData.profileUrl}`} />
          </UserInfo>
        </Link>
      ) : null}
    </Wrapper>
  );
};

export default Header;
