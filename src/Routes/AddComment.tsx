import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { allUserData } from "../atoms";
import { DOMAIN_URL } from "../apiKeys";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 70px;
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

const AddComment = () => {
  const { register, handleSubmit } = useForm();
  const loggedInUserInfo = useRecoilValue(allUserData);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    const { title, content } = data;
    const sendComment: IComment = {
      id: Date.now(),
      title,
      content,
      upvote: 0,
      username: loggedInUserInfo.username,
    };
    try {
      const response = await axios.post(
        `${DOMAIN_URL}/comment/add`,
        sendComment
      );
      navigate("/openAI/comments");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Wrapper>
      <CommentForm onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("title", { required: true })}
          placeholder="Add Title"
        />
        <input
          {...register("content", { required: true })}
          placeholder="Add Content"
        />
        <button>Post</button>
      </CommentForm>
    </Wrapper>
  );
};

export default AddComment;
