import { Button } from "react-bootstrap";
import { logout } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Button
      onClick={logoutHandler}
      variant="light"
      className="border-0 rounded-0"
    >
      Logout
    </Button>
  );
};

export default Logout;