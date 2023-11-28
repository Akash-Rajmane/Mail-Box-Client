import { Alert } from "react-bootstrap";


const Notification = (props) => {
 
  return <Alert variant={props.variant} >{props.message}</Alert>;
};

export default Notification;