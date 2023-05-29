import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useResetRecoilState } from "recoil";
import styled from "styled-components";
import { allUserData, widthSize } from "../atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubes,
  faHome,
  faMessage,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
const Nav = styled.div`
  min-width: 80px;
  height: 100%;
  color: #aaaaaa;
  background-color: #fafbff;
  font-size: 30px;
  font-weight: 1000;
  display: flex;
  flex-direction: column;
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 80%;
  width: 100%;
`;
const Item = styled.div`
  padding: 20px 0px;
  text-align: center;
  cursor: pointer;
`;
const Setting = styled.div`
  height: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Navigate() {
  const [width, setWidth] = useRecoilState(widthSize);
  const navigate = useNavigate();
  const resetUserData = useResetRecoilState(allUserData);
  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
  });

  const resetData = () => {
    localStorage.clear();
    resetUserData();
    navigate("/openAI/home");
    window.location.reload();
  };

  return (
    <Nav>
      <Items>
        <Link to="/openAI/home">
          <Item>
            <FontAwesomeIcon icon={faHome}></FontAwesomeIcon>
          </Item>
        </Link>
        <Link to="/openAI/chat">
          <Item>
            <FontAwesomeIcon icon={faMessage}></FontAwesomeIcon>
          </Item>
        </Link>
        <Link to="/openAI/comments">
          <Item>
            <FontAwesomeIcon icon={faCubes}></FontAwesomeIcon>
          </Item>
        </Link>
      </Items>
      <Setting>
        <Item onClick={resetData}>
          <FontAwesomeIcon icon={faRightFromBracket}></FontAwesomeIcon>{" "}
        </Item>
      </Setting>
    </Nav>
  );
}

export default Navigate;
