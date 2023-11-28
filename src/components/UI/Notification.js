import { Alert } from "react-bootstrap";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/authSlice";


const Notification = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(showNotification({ message: null, variant: null }));
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch]);
 
  return <Alert variant={props.variant} >{props.message}</Alert>;
};

export default Notification;