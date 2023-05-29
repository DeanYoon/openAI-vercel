import { Link } from "react-router-dom";
import styled from "styled-components";
import User from "./Users";

const Title = styled.div`
  font-size: 40px;
  font-weight: 1000;
`;

const Admin = () => {
  return (
    <section>
      <Title>Welcome to Dean's ChatBot Project</Title>
      <br />
      <User />
      <br />
    </section>
  );
};

export default Admin;
