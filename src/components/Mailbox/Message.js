import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Button } from "react-bootstrap";
import LoadingSpinner from "../UI/LoadingSpinner";
import { moveToTrash, deleteForever } from "../../store/mailSlice";
import { moveToTrashSent, deleteForeverSent } from "../../store/sentMailsSlice";
import { showNotification } from "../../store/authSlice";
import axios from "axios";

const Message = () => {
  const { messageId } = useParams();
  const mails = useSelector((state) => state.mail.mails);
  const sentMails = useSelector((state) => state.sentMails.sentMails);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const mailItem =
    location.pathname === `/sent/${messageId}`
      ? sentMails.filter((mail) => mail.id === messageId)
      : mails.filter((mail) => mail.id === messageId);

  const [mail] = mailItem;

  const onBackHandler = () => {
    navigate(
      location.pathname === `/home/${mail.id}`
        ? "/home"
        : location.pathname === `/trash/${mail.id}`
        ? "/trash"
        : location.pathname === `/sent/${mail.id}`
        ? "/sent"
        : "/starred"
    );
  };

  const moveToTrashHandler = async () => {
    if(location.pathname!==`/sent/${mail.id}`){
      try {
        const response = await axios.put(
          `https://mail-box-client-46880-default-rtdb.firebaseio.com/emails/${messageId}.json`,
          {
            ...mail,
            trashed: true,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          dispatch(moveToTrash(messageId));
          dispatch(
            showNotification({ message: "Moved to trash!", variant: "success" })
          );
          navigate("/home");
        }
      } catch (error) {
        console.log(error.message);
      }
    }else{
      try {
        const response = await axios.put(
          `https://mail-box-client-46880-default-rtdb.firebaseio.com/sent-emails/${mail}/${messageId}.json`,
          {
            ...mail,
            trashed: true,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          dispatch(moveToTrashSent(messageId));
          dispatch(
            showNotification({ message: "Moved to trash!", variant: "success" })
          );
          navigate("/home");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
   
  };

  const deleteForeverHandler = async () => {
    if(location.pathname!==`/sent/${mail.id}`){
      dispatch(deleteForever({ id: messageId }));
      navigate("/trash");
      try {
        const response = await axios.delete(
          `https://mail-box-client-46880-default-rtdb.firebaseio.com/emails/${messageId}.json`
        );

        const data = response.data;
        if (response.status === 200) {
          dispatch(
            showNotification({
              message: "Mail deleted forever",
              variant: "success",
            })
          );
        }
        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    }else{
      dispatch(deleteForeverSent({ id: messageId }));
      navigate("/trash");
      try {
        const response = await axios.delete(
          `https://mail-box-client-46880-default-rtdb.firebaseio.com/sent-emails/${mail}/${messageId}.json`
        );

        const data = response.data;
        if (response.status === 200) {
          dispatch(
            showNotification({
              message: "Mail deleted forever",
              variant: "success",
            })
          );
        }
        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    
  };

  


  if (location.pathname!==`/sent/${mail.id}` && mails.length === 0) {
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
        <div className="border-bottom py-2 d-flex align-items-center">
        <p
          className="m-0"
          onClick={onBackHandler}
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-arrow-left pe-2"></i>
          <span>Back</span>
        </p>

        {location.pathname === `/home/${messageId}` ? (
          <Button
            variant="secondary"
            className="px-2 mb-1 border-0 ms-auto mx-lg-auto"
            onClick={moveToTrashHandler}
          >
            <p className="mx-auto p-0 m-0">
              <i className="bi pe-2 bi-trash3"></i>
              <span className="">Delete</span>
            </p>
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="px-2 mb-1 border-0 ms-auto mx-lg-auto"
            onClick={deleteForeverHandler}
          >
            <p className="mx-auto p-0 m-0">
              <i className="bi pe-2 bi-trash3"></i>
              <span className="">Delete Forever</span>
            </p>
          </Button>
        )}
      </div>
      <div className="pt-3">
        <span className="fw-bold">From:</span>
        <span> {mailItem[0].sender} </span>
      </div>
      <div className="pt-3">
        <span className="fw-bold">To:</span>
        <span>{mailItem[0].recipient} </span>
      </div>
      <div className="mt-5 bg-light h-100 mx-lg-auto">
        {mailItem[0].emailContent?.blocks[0].text}
      </div>
    </Container>
  );
};

export default Message;