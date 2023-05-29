import { FinishKakaoLogin } from "../Components/KakaoLogin";

const Athentication = () => {
  const code = new URL(window.location.href).searchParams.get("code");

  return (
    <div>
      <FinishKakaoLogin code={code} />
    </div>
  );
};

export default Athentication;
