import { useEffect } from "react";
import { GetUser } from "../../services/getUser";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setAuthorized } from "../../../slicer/slicer";

export default function CheckAuth({ children }) {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  // Fetch user once
  useEffect(() => {
    const fetchUser = async () => {
      const data = await GetUser();
      dispatch(setUser(data));
    };

    fetchUser();
  }, [dispatch]);

  // Handle Authorization When User Changes
  useEffect(() => {
    if (!user) return;

    if (user === "Unauthorized") {
      dispatch(setAuthorized(false));
    } else {
      dispatch(setAuthorized(true));
    }
  }, [user, dispatch]);

  return children;
}
