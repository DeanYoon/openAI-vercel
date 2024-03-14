import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { loginState, widthSize } from "./atoms";
import Header from "./Components/Header";
import Navigate from "./Components/Navigate";
import Home from "./Routes/Home";
import Chat from "./Routes/Chat";
import Athentication from "./Routes/Athentication";
import Signup from "./Routes/Signup";
import Comments from "./Routes/Comments";
import AddComment from "./Routes/AddComment";
import Profile from "./Routes/Profile";

const Main = styled.div`
  width: 90vw;
  height: 90vh;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  border-radius: 10px;
  overflow: hidden;
  display: flex;
  position: relative;
`;

function App() {
  const width = useRecoilValue(widthSize);
  const isLoggedIn = useRecoilValue(loginState);

  return (
    <BrowserRouter>
      <Main>
        {width < 500 ? null : <Navigate />}
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/openAI/home" element={<Home />}></Route>
          <Route
            path="/openAI/chat"
            element={isLoggedIn ? <Chat /> : <Home />}
          ></Route>
          <Route path="/kakao-login" element={<Athentication />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/openAI/comments" element={<Comments />}></Route>
          <Route path="/openAI/comments/add" element={<AddComment />}></Route>
          <Route path="/openAI/profile" element={<Profile />}></Route>
        </Routes>
      </Main>
    </BrowserRouter>
  );
}

export default App;
