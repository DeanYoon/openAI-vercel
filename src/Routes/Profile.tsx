import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { allUserData } from "../atoms";
import { useEffect, useState } from "react";
import { hashPassword } from "../Components/hash";
import { DOMAIN_URL } from "../apiKeys";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 70px;
  img {
    width: 100px;
    height: 100px;
  }
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
`;
export type IComment = {
  id: number;
  title: string;
  content: string;
  username: string;
  upvote: number;
};

interface iData {
  password: string;
  password_conf: string;
  profileImg: object;
  username: string;
}

const Profile = () => {
  const { register, handleSubmit } = useForm();
  const [loggedInUserInfo, setLoggedInUserInfo] = useRecoilState(allUserData);
  const [updatedInfo, setUpdatedInfo] = useState({
    username: loggedInUserInfo.username,
    password: "",
  });
  const navigate = useNavigate();
  const [imageData, setImageData] = useState<string>(
    loggedInUserInfo.profileUrl
  );

  const onSubmit = async (data: any) => {
    if (data.password !== data.password_conf) {
      alert("Password do not match");
      window.location.reload();
      return;
    }
    const edittedUserData = {
      ...loggedInUserInfo,
      profileUrl: imageData,
      username: data.username ? data.username : loggedInUserInfo.username,
      password: data.password
        ? await hashPassword(data.password)
        : loggedInUserInfo.password,
    };

    try {
      const response = await axios.post(`${DOMAIN_URL}/profile/edit`, {
        edittedUserData: edittedUserData,
        prevUsername: loggedInUserInfo.username,
      });
      setLoggedInUserInfo(edittedUserData);
      console.log(response);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      //returns Base64-encoded url
      reader.readAsDataURL(file);
      reader.onload = () => {
        //Resize process

        //loads image into img
        const img = new Image();
        img.src = reader.result as string;
        //size setting
        img.onload = () => {
          //create canvas element and set max width

          // create a new canvas element
          const canvas = document.createElement("canvas");
          // set the maximum width of the image to be 800 pixels
          const MAX_WIDTH = 800;
          // calculate the scale size based on the image width and maximum width
          const scaleSize = MAX_WIDTH / img.width;
          // set the width and height of the canvas based on the maximum width and scaled height
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          // get the 2D rendering context of the canvas
          const ctx = canvas.getContext("2d");
          // draw the image onto the canvas with the scaled dimensions
          ctx && ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // convert the canvas to a data URL with JPEG format and 80% quality
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          // set the image data as the value of the "image" input field
          setImageData(dataUrl);
        };
      };
    }
  };

  return (
    <Wrapper>
      <img src={imageData} />
      <input
        {...register("profileImg")}
        type="file"
        accept=".jpg, .jpeg, .png, .gif, .svg"
        onChange={handleFileUpload}
      />
      <CommentForm onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("username", { required: true })}
          placeholder="username"
          onChange={(e) =>
            setUpdatedInfo({ ...updatedInfo, username: e.target.value })
          }
          value={updatedInfo.username}
        />
        <input
          type="password"
          {...register("password")}
          placeholder="password"
        />
        <input
          type="password"
          {...register("password_conf")}
          placeholder="confirm password"
        />

        <button>Post</button>
      </CommentForm>
    </Wrapper>
  );
};

export default Profile;
