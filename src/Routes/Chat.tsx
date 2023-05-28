// import { debug } from "console";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import styled from "styled-components";
import {
  allUserData,
  botCharacter,
  botPrompt,
  chatDatas,
  IAllChatData,
  isSoundOn,
  widthSize,
} from "../atoms";
// Clear the data stored in localStorage
import { character } from "../Components/characterData";

import InputMessage from "../Components/InputMessage";
import User from "../models/User";
import { OPENAI_API_KEY } from "../apiKeys";

const Friends = styled.div`
  padding-top: 70px;
  width: 350px;
`;
const FriendsButton = styled.button`
  display: flex;
  width: 100%;
  padding: 10px;
  border: none;
  background-color: inherit;
  font-size: 20px;
`;
const Image = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 20px;
  border-radius: 30px;
  pointer-events: none;
`;

const ChatHeader = styled.div`
  height: 80px;
  width: 100%;
  margin-top: 40px;
  margin-bottom: 20px;
  padding: 20px 10px 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
interface ButtonProps {
  width: number;
}

const SoundToggleBtn = styled.div`
  width: 30px;

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
`;
const ResetButton = styled.div<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 100%;
  background-color: black;
  font-size: ${(props) => (props.width > 500 ? "20px" : "15px")};
  color: red;
  font-weight: 1000;
  border-radius: 20px;
  margin: 0 20px;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 1000;
  text-align: center;
  width: 100%;
`;

const ChatBotWrapper = styled.div`
  padding: 30px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  background-color: #f6f7ff;
  padding-bottom: 100px;
  min-width: 300px;
  width: 100%;
  position: relative;
`;

const ChatBox = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding: 0 30px;
  min-width: 375px;
`;

const ChatBoxMessage = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 20px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  position: relative;
`;

const ChatFromMe = styled.div`
  background-image: linear-gradient(to right, rgb(96, 131, 226), #7eb1ff);
  margin-left: auto;
  padding: 10px;
  border-radius: 10px;
  max-width: 40%;
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  color: white;
  border-top-right-radius: 0px;
  overflow-x: scroll;
`;

const ChatFromAi = styled.div`
  background-color: white;
  color: gray;
  margin-right: auto;
  padding: 10px;
  border-radius: 10px;
  max-width: 60%;
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 0px;
`;
const ChatTime = styled.div`
  font-size: 15px;
  text-align: end;
  position: absolute;
  bottom: 10px;
  right: 0;
`;
export interface iChatBubbleProps {
  id: number;
  text: string;
  i: number;
}

function Chat() {
  const [botType, setBotType] = useRecoilState(botCharacter);
  const [botTypePrompt, setBotTypePrompt] = useRecoilState(botPrompt);
  const resetAllData = useResetRecoilState(chatDatas);
  const width = useRecoilValue(widthSize);
  const [isSound, setIsSound] = useRecoilState(isSoundOn);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const botTypeForRender = botType.toLowerCase();

  const [allUserDatas, setAllUserDatas] = useRecoilState(allUserData);
  function setBotChracter(e: any) {
    setBotType(e.target.textContent);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  //scroll to bottom
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [allUserDatas, botType]);

  useEffect(() => {
    const texts = character.find((obj) => obj.title === botType)?.text;
    texts && setBotTypePrompt(texts);
    Cookies.get("jwt");
    // resetData();
  }, [botType]);

  return (
    <>
      <Friends>
        {character.map((data) => (
          <FriendsButton
            onClick={setBotChracter}
            style={{
              backgroundColor: data.title === botType ? "#f6f7ff" : "inherit",
            }}
          >
            {width < 500 ? null : <Image src={data.imageUrl} />}
            {width < 800 ? "" : data.title}
          </FriendsButton>
        ))}
      </Friends>
      <ChatBotWrapper>
        <ChatHeader>
          {/* <ResetButton width={width} onClick={resetData}>
            Reset
          </ResetButton> */}
          <Title>{botType} Chat Bot</Title>
          <SoundToggleBtn onClick={() => setIsSound((prev: boolean) => !prev)}>
            <FontAwesomeIcon icon={isSound ? faVolumeHigh : faVolumeXmark} />
          </SoundToggleBtn>
        </ChatHeader>
        <ChatBox ref={chatBoxRef}>
          {allUserDatas.chatData[botTypeForRender].myTextList
            ? allUserDatas.chatData[botTypeForRender].myTextList.map(
                (textObj, i) => (
                  <ChatBoxMessage key={`${textObj.id}Box`}>
                    <ChatFromMe key={`${textObj.id}Me`}>
                      {textObj.text}
                    </ChatFromMe>

                    <ChatFromAi key={textObj.id}>
                      {allUserDatas.chatData[botTypeForRender].aiTextList[i]
                        ? allUserDatas.chatData[botTypeForRender].aiTextList[i]
                            .text
                        : "Writing..."}
                    </ChatFromAi>
                    <ChatTime key={`${textObj.id}time`}>
                      {textObj.time}
                    </ChatTime>
                  </ChatBoxMessage>
                )
              )
            : null}
        </ChatBox>
        <InputMessage />
      </ChatBotWrapper>
    </>
  );
}

export default Chat;
