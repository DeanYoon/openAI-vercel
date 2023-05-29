import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { IComment } from "./AddComment";
import { DOMAIN_URL } from "../apiKeys";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 70px;
`;

const CommentList = styled.ul`
  li {
    font-size: 20px;
  }
`;
const Comment = styled.li``;

const Comments = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${DOMAIN_URL}/comments`);
      setComments(response.data);
    };
    fetchData();
  }, []);

  return (
    <Wrapper>
      <CommentList>
        {comments.map((comment: IComment) => {
          return (
            <li key={comment.id}>
              <span>{comment.username} : </span>
              <span>{comment.title}</span>
            </li>
          );
        })}
      </CommentList>
      <Link to={`add`}>
        <button>Add Comment</button>
      </Link>
    </Wrapper>
  );
};

export default Comments;
