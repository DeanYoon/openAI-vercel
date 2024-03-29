import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useResetRecoilState } from "recoil";
import styled from "styled-components";
import { allUserData, loginState, savedJwt } from "../atoms";
import { generateToken } from "../services/auth";
import Cookies from "js-cookie";

import { DOMAIN_URL, KAKAO_CLIENT, KAKAO_CLIENT_SECRET } from "../apiKeys";

const URL = process.env.REACT_APP_REDIRECT_URL;

const KakaoIcon = styled(FontAwesomeIcon)`
  scale: 1.3;
  width: 20px;
`;

const KakaoButton = styled.button`
  font-size: 15px;
  background-color: #ffeb00;
  height: 35px;
  border-radius: 30px;
  border: none;
  padding: 10px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  &:hover {
    background-color: #ffdd00;
  }
  a {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export const KakaoLogin = () => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: `${KAKAO_CLIENT}`,
    redirect_uri: `${URL}/kakao-login`,
    response_type: "code",
  };
  const params = new URLSearchParams(config).toString();

  const finalUrl = `${baseUrl}?${params}`;
  return (
    <KakaoButton>
      <a href={finalUrl}>
        <KakaoIcon icon={faComment}></KakaoIcon>
      </a>
    </KakaoButton>
  );
};

interface FinishKakaoLoginProps {
  code: string | null;
}

export interface IUserData {
  id: string;
  nickname: string;
  profile_image: string;
  password: string;
}
export const FinishKakaoLogin = ({ code }: FinishKakaoLoginProps) => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);
  const navigate = useNavigate();
  const [allUserDatas, setAllUserDatas] = useRecoilState(allUserData);
  const [jwt, setJwt] = useRecoilState(savedJwt);
  useEffect(() => {
    const baseUrl = "https://kauth.kakao.com/oauth/token";
    const config = {
      client_id: `${KAKAO_CLIENT}`,
      client_secret: `${KAKAO_CLIENT_SECRET}`,
      grant_type: "authorization_code",
      redirect_uri: `${URL}/kakao-login`,
      code: code as string,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    const fetchKakaoData = async () => {
      const kakaoTokenRequest = await axios.post(finalUrl, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      });

      if ("access_token" in kakaoTokenRequest.data) {
        const { access_token } = kakaoTokenRequest.data;
        const userDataFromKakao = await axios.get(
          "https://kapi.kakao.com/v2/user/me",
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-type": "application/json",
            },
          }
        );

        //recoil 전역 변수에 유저 데이터 저장 (꼭 필요한지?)
        const {
          id,
          properties: { profile_image, nickname },
        } = userDataFromKakao.data;
        console.log(userDataFromKakao.data);
        const loggedInUserData: IUserData = {
          id,
          nickname,
          profile_image,
          password: "",
        };

        //Session Storage에 userdata 저장
        sessionStorage.setItem("userData", JSON.stringify(loggedInUserData));
        const jwt = generateToken(loggedInUserData);
        setJwt(jwt);
        //save jwt in HTTP Only Cookie
        Cookies.set("jwt", jwt, {
          httpOnly: true,
          sameSite: "strict",
          expires: 1,
        });

        try {
          const response = await axios.post(
            `${DOMAIN_URL}/users/${loggedInUserData.nickname}`,

            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          );
          console.log(response);
          setAllUserDatas(response.data);
        } catch (error) {
          console.error(error);
        }

        setIsLoggedIn(true);
        navigate("/openAI/chat");
      }
    };
    fetchKakaoData();
  }, [code]);

  return <></>;
};

export const KakaoLogout = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);
  const handleClick = () => {
    setIsLoggedIn(false);
  };
  return <KakaoButton onClick={handleClick}>로그아웃</KakaoButton>;
};
