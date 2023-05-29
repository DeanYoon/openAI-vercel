import { initialChatData, IUser } from "../atoms";
import { character } from "./characterData";
import { IUserData } from "./KakaoLogin";

export const initialData = (loggedInUserData?: IUserData): IUser => {
  const defaultId = Date.now();
  return {
    id: loggedInUserData?.id ? loggedInUserData.id : defaultId.toString(),
    profileUrl: loggedInUserData?.profile_image
      ? loggedInUserData?.profile_image
      : "https://img.freepik.com/free-icon/user_318-804790.jpg",
    username: loggedInUserData?.nickname
      ? loggedInUserData?.nickname
      : "Anonymous",
    password: loggedInUserData?.password || "",

    chatData: Object.fromEntries(
      character.map(({ title }) => [title.toLowerCase(), initialChatData])
    ),
  };
};
