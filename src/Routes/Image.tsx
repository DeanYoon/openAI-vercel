import { useState } from "react";
import styled from "styled-components";

import {
  Configuration,
  OpenAIApi,
  CreateImageRequest,
  CreateImageRequestSizeEnum,
} from "openai";
import { useForm } from "react-hook-form";

const GetEmotionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  background-color: ${(props) => props.theme.gray.light};
  padding-top: 100px;
`;

const InputHead = styled.form``;
const Img = styled.img`
  width: 500px;
  height: 500px;
`;

const REACT_APP_OPENAI_API_KEY =
  "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";
const configuration = new Configuration({
  apiKey: REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function Image() {
  const [userPrompt, setUserPrompt] = useState("");
  const [number, setNumber] = useState(1);
  const [imageUrl, setImageUrl] = useState<string | undefined>("");
  const [text, setText] = useState("");
  const { register, handleSubmit } = useForm();

  async function generateImage() {
    const imageParameters: CreateImageRequest = {
      prompt: userPrompt,
      n: number,
      size: CreateImageRequestSizeEnum._512x512,
    };
    const response = await openai.createImage(imageParameters);
    const urlData = response.data.data[0].url;
    setImageUrl(urlData);
  }
  return (
    <GetEmotionWrapper>
      <InputHead>
        <input
          {...register("prompt", { required: true })}
          placeholder="add Text"
          value={text}
        />
        <button onClick={generateImage}>Generate it</button>
      </InputHead>
      {imageUrl && <Img src={imageUrl} />}
    </GetEmotionWrapper>
  );
}

export default Image;
