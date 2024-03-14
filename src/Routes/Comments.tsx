import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { IComment } from "./AddComment";
import { DOMAIN_URL } from "../apiKeys";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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

const Comments = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // const response = await axios.get(`${DOMAIN_URL}/comments`);

      await fetch(`${DOMAIN_URL}/comments`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
      // setComments(response.data);
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
              <span>{comment.content}</span>
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
