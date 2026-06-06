import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notfound">
      <h1>페이지를 찾을 수 없어요</h1>
      <p>요청하신 작품이나 회차가 존재하지 않습니다.</p>
      <Link className="btn btn--primary" to="/">
        홈으로
      </Link>
    </div>
  );
}
