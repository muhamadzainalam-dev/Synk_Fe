import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function isLogedin({ children }) {
  const navigate = useNavigate();
  const isAuthorized = useSelector((state) => state.user.isAuthorized);

  console.log(isAuthorized);

  if (isAuthorized == false) {
    return children;
  } else {
    return navigate("/");
  }
}
