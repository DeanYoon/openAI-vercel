import { IUserData } from "../Components/KakaoLogin";
import sign from "jwt-encode";

const REACT_APP_JWT_SECRET = "afnndasjdnlawnd";

export const generateToken = (user: IUserData) => {
  const payload = {
    sub: user.id,
    username: user.nickname,
    imgUrl: user.profile_image,
  };
  const jwt = sign(payload, REACT_APP_JWT_SECRET);
  return jwt;
};
