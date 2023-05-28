import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { allUserData, loginState } from "../atoms";
import { hashPassword } from "../Components/hash";
import { initialData } from "../Components/initialUserData";
import { IUserData, KakaoLogin } from "../Components/KakaoLogin";
import { DOMAIN_URL } from "../apiKeys";

const HomeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  color: red;
  font-size: 30px;

  width: 100%;
`;
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
    height: 40px;
    background-color: inherit;
    border: none;
    outline: none;
    font-size: 20px;
    padding-left: 10px;
    &::placeholder {
      color: #ffffff94;
    }
  }
`;
const Buttons = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const LoginButton = styled.button`
  padding: 0 40px;
  border-radius: 40px;
  height: 40px;
  border: none;
`;
function Signup() {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);
  const { register, handleSubmit } = useForm();
  const [isWrongPassword, setIsWrongPassword] = useState("");
  const [isUsernameExist, setIsUsernameExist] = useState("");
  const [button, setButton] = useState(true);
  const [allUserDatas, setAllUserDatas] = useRecoilState(allUserData);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    const loggedInUserData: IUserData = {
      id: "",
      nickname: data.username,
      profile_image: "",
      password: await hashPassword(data.password),
    };
    if (data.password === data.passwordConfirm) {
      setIsWrongPassword("");
      try {
        const response = await axios.post(
          `${DOMAIN_URL}/signup`,
          initialData(loggedInUserData)
        );

        if (response) {
          setIsLoggedIn(true);
          setAllUserDatas(response.data);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        // setErrorMessage(axiosError.response?.data as string);
        setIsUsernameExist(axiosError.response?.data as string);
      }
    } else {
      setIsWrongPassword("Invalid Password");
      setIsUsernameExist("");
    }
  };

  useEffect(() => {
    isLoggedIn && navigate("/openAI/chat");
  }, [isLoggedIn]);

  return (
    <HomeWrapper>
      <LoginBox>
        <LoginForm onSubmit={handleSubmit(onSubmit)}>
          <LoginHead>
            {isUsernameExist
              ? isUsernameExist
              : isWrongPassword
              ? isWrongPassword
              : "SIGNUP"}
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
            <input
              type="password"
              {...register("passwordConfirm", { required: true })}
              placeholder="CONFIRM PASSWORD"
            />
          </LoginInput>
          <Buttons>
            <LoginButton onClick={() => setButton((prev) => !prev)}>
              SIGN-UP
            </LoginButton>
          </Buttons>
        </LoginForm>
        <SocialLoginButton>
          <KakaoLogin />
        </SocialLoginButton>
      </LoginBox>
    </HomeWrapper>
  );
}

export default Signup;
