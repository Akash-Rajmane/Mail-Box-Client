import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Container, Button } from "react-bootstrap";
import LoadingSpinner from "../UI/LoadingSpinner";

const Message = () => {
  const { messageId } = useParams();
  const mails = useSelector((state) => state.mail.mails);
  const navigate = useNavigate();
  const mailItem = mails.filter((mail) => mail.id === messageId);
 

  const onBackHandler = () => {
    navigate("/home");
  };

  


  if (mails.length === 0) {
    return (
      <Container className="h-100">
        <div className="h-100 d-flex justify-content-center align-items-center">
          <LoadingSpinner></LoadingSpinner>
        </div>
      </Container>
    );
  }

  return (
    <Container className="px-3"  style={{width:"calc(100% - 350px)", left:"300px",top:"0", position:"fixed"}}>
      <div className="border-bottom pt-3 d-flex">
        <p onClick={onBackHandler} style={{ cursor: "pointer" }}>
          <i className="bi bi-arrow-left pe-2"></i>
          <span>Back</span>
        </p>

        <Button
          variant="secondary"
          className="px-2 mb-1 border-0 ms-auto mx-lg-auto"
        >
          <p className="mx-auto p-0 m-0">
            <i className="bi pe-2 bi-trash3"></i>
            <span className="">Delete</span>
          </p>
        </Button>
      </div>
      <div className="pt-3">
        <span className="fw-bold">From:</span>
        <span> {mailItem[0].sender} </span>
      </div>
      <div className="pt-3">
        <span className="fw-bold">To:</span>
        <span>me {`(${mailItem[0].recipient})`} </span>
      </div>
      <div className="mt-5 bg-light h-100 mx-lg-auto">
        {mailItem[0].emailContent?.blocks[0].text}
      </div>
    </Container>
  );
};

export default Message;