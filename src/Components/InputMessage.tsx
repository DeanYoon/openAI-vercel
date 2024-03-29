import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { OpenAIApi, Configuration } from "openai";

import {
  allUserData,
  botCharacter,
  botPrompt,
  chatDatas,
  inputText,
  isListeningMic,
  isLoadingAPI,
  isSoundOn,
  ITextData,
  IUser,
  savedJwt,
} from "../atoms";
import { DOMAIN_URL, OPENAI_API_KEY } from "../apiKeys";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { characterName, character } from "./characterData";
import axios from "axios";

const ChatBotForm = styled.form`
  bottom: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 20px;
  position: relative;
  input {
    font-size: 20px;
    padding: 4px;
    padding-left: 20px;
    width: 100%;
    border: none;
    height: 40px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    transition: all 0.3s ease-in-out;
    padding-right: 100px;

    &:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }
    &::placeholder {
      font-size: 15px;
    }
  }
  button {
    border: none;
    right: 0;
    font-size: 20px;
    background-color: white;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  position: absolute;
  width: 80px;
  right: 30px;
  top: 8px;

  button {
    background-color: inherit;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const SendButton = styled.button``;
const MicButton = styled.button``;

const LanguageSelect = styled.select`
  appearance: none;
  padding: 5px;
  border: none;
  cursor: pointer;
  font-size: 10px;
  background-color: inherit;
`;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const mic = new SpeechRecognition();
mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";
const languages = [
  { label: "En", value: "en-US" },
  { label: "Kr", value: "ko-KR" },
  { label: "Jp", value: "ja-JP" },

  // add more languages here
];

const configiration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const InputMessage = () => {
  const { register, handleSubmit } = useForm();
  const [text, setText] = useRecoilState(inputText);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingAPI);
  const [isListening, setIsListening] = useRecoilState(isListeningMic);
  const [note, setNote] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState("");

  const botTypePrompt = useRecoilValue(botPrompt);
  const [botType, setBotType] = useRecoilState(botCharacter);
  const isSound = useRecoilValue(isSoundOn);
  const inputRef = useRef<HTMLInputElement>(null);
  const category = botType.toLowerCase();
  const [currentLanguage, setCurrentLanguage] = useState(languages[0].value);
  const [allUserDatas, setAllUserDatas] = useRecoilState(allUserData);
  const jwt = useRecoilValue(savedJwt);
  function getTimeNow() {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return formattedTime;
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [botType, currentLanguage]);

  const addNewData = (
    category: string,
    text: string,
    time: string,
    fromMe: boolean
  ) => {
    setAllUserDatas((prevData) => {
      const newData = {
        id: fromMe
          ? prevData.chatData[category].myTextList.length + 1
          : prevData.chatData[category].aiTextList.length + 1,
        text,
        time,
      };
      return {
        ...prevData,
        chatData: {
          ...prevData.chatData,
          [category]: {
            myTextList: fromMe
              ? [...prevData.chatData[category].myTextList, newData]
              : prevData.chatData[category].myTextList,
            aiTextList: fromMe
              ? prevData.chatData[category].aiTextList
              : [...prevData.chatData[category].aiTextList, newData],
          },
        },
      };
    });
  };

  const onValid = (data: any) => {};
  async function callOpenApi() {
    if (!text) {
      return;
    }
    setIsLoading(true);
    setIsListening(false);
    addNewData(category, text, getTimeNow(), true);
    setText("");

    try {
      const selectedCharacter = character.filter((character) => {
        return character.title.toLowerCase() === category;
      });

      // const { data } = await axios.post(`${DOMAIN_URL}/chat`, {
      //   category: selectedCharacter[0].text,
      //   data: text,
      // });

      // addNewData(category, data, getTimeNow(), false);
      // setIsLoading(false);
      // setAiAnswer(data);

      await fetch(`${DOMAIN_URL}/chat`, {
        method: "POST",
        body: JSON.stringify({
          category: selectedCharacter[0].text,
          data: text,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          addNewData(category, data, getTimeNow(), false);
          setIsLoading(false);
          setAiAnswer(data);
        });
    } catch (error) {
      console.error(error);
      addNewData(
        category,
        "failed to load text from ChatGPT",
        getTimeNow(),
        false
      );
      setIsLoading(false);
    }
  }

  ///////////////// ///speech to text///////////////////////////////

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        setNote(transcript);
      };
    } else {
      mic.stop();
    }
  };
  useEffect(() => {
    handleListen();
  }, [isListening]);

  useEffect(() => {
    if (typeof note === "string") {
      setText(note);
    }
  }, [note]);
  const handleChange = (event: any) => {
    setCurrentLanguage(event.target.value);
  };
  useEffect(() => {
    mic.lang = currentLanguage;
  }, [currentLanguage]);

  /////////////// Text to Speech //////////////////////

  useEffect(() => {
    // axios
    //   .post(`${DOMAIN_URL}/users/${allUserDatas.username}`, allUserDatas)
    //   .then((response) => console.log("Success", response))
    //   .catch((error) => console.error(error));

    const voices = speechSynthesis.getVoices();
    if (isSound) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(aiAnswer);
      utterance.lang = currentLanguage;
      utterance.voice = voices.filter(
        (voice) => voice.lang === currentLanguage
      )[22]; //22
      utterance.volume = 0.4;
      utterance.rate = 0.9;
      synth.speak(utterance);
    }
  }, [aiAnswer, languages]);

  return (
    <ChatBotForm onSubmit={handleSubmit(onValid)}>
      <input
        {...register("prompt", { required: true })}
        onChange={(e) => setText(e.target.value)}
        placeholder="add text"
        value={text}
        autoComplete="off"
        ref={inputRef}
        required
      />
      <Buttons>
        <SendButton onClick={callOpenApi} disabled={isLoading}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </SendButton>
        <MicButton onClick={() => setIsListening((prev) => !prev)}>
          <FontAwesomeIcon
            icon={isListening ? faMicrophoneSlash : faMicrophone}
          />
        </MicButton>
        <LanguageSelect value={currentLanguage} onChange={handleChange}>
          {languages.map((language) => (
            <option key={language.value} value={language.value}>
              {language.label}
            </option>
          ))}
        </LanguageSelect>
      </Buttons>
    </ChatBotForm>
  );
};

export default InputMessage;
