import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { allUserData, apiKey, iApiKey, loginState, savedJwt } from "../atoms";

import { IUserData, KakaoLogin, KakaoLogout } from "../Components/KakaoLogin";
import { generateToken } from "../services/auth";
import { initialData } from "./initialUserData";
import { hashPassword } from "./hash";
import { DOMAIN_URL } from "../apiKeys";

const LoginBox = styled.div`
  position: relative;
`;
const SocialLoginButton = styled.div`
  position: absolute;
  right: 30px;
  bottom: 30px;
`;

const LoginForm = styled.form`
  width: 400px;
  height: 300px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  background-image: linear-gradient(to right, rgb(127, 149, 210), #7eb1ff);
`;
const LoginHead = styled.div`
  border-bottom: 1px solid white;
  width: 300px;
  text-align: center;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: white;
  padding-bottom: 10px;
`;
const LoginInput = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  input {
    color: white;
    height: 50px;
    background-color: inherit;
    border: none;
    outline: none;
    font-size: 20px;
    padding: 20px;
    &::placeholder {
      color: #ffffff94;
    }
  }
`;
const Buttons = styled.div`
  display: flex;
  width: 100%;
  justify-content: start;
  align-items: center;
`;

const LoginButton = styled.button`
  padding: 0 40px;
  border-radius: 40px;
  height: 40px;
  border: none;
  margin-right: 20px;
`;

function Login() {
  const { register, handleSubmit } = useForm();
  const [allUserDatas, setAllUserDatas] = useRecoilState(allUserData);
  const [jwt, setJwt] = useRecoilState(savedJwt);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const onSubmit = async (data: any) => {
    const loggedInUserData: IUserData = {
      id: "",
      nickname: data.username,
      profile_image: "",
      password: await hashPassword(data.password),
    };
    console.log(loggedInUserData);
    const jwt = generateToken(loggedInUserData);
    setJwt(jwt);
    try {
      const response = await axios.post(`${DOMAIN_URL}/login`, data, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log(response);
      setAllUserDatas(response.data);
      setIsLoggedIn(true);
    } catch (error) {
      const axiosError = error as AxiosError;
      setErrorMessage(axiosError.response?.data as string);
    }
  };

  return (
    <LoginBox>
      <LoginForm onSubmit={handleSubmit(onSubmit)}>
        <LoginHead>
          {errorMessage ? (
            <span style={{ color: "red" }}>{errorMessage}</span>
          ) : (
            "LOGIN"
          )}
        </LoginHead>
        <LoginInput>
          <input
            {...register("username", { required: true })}
            placeholder="USERNAME"
          />
          <input
            type="password"
            {...register("password", { required: true })}
            placeholder="PASSWORD"
          />
        </LoginInput>
        <Buttons>
          <LoginButton>LOGIN</LoginButton>
          <Link to="/signup">
            <LoginButton>SIGN-UP</LoginButton>
          </Link>
        </Buttons>
      </LoginForm>
      <SocialLoginButton>
        <KakaoLogin />
      </SocialLoginButton>
    </LoginBox>
  );
}

export default Login;
