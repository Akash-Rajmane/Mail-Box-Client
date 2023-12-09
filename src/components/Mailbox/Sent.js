import Selector from "../Mailbox/Selector";
import { ListGroup } from "react-bootstrap";
import LoadingSpinner from "../UI/LoadingSpinner";
import MailListItems from "../Mailbox/MailListItems";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Sent = () => {
  const sentMails = useSelector((state) => state.sentMails.sentMails);
  const isLoading = useSelector((state) => state.mail.isLoading);

  const isDeleteEnabled = sentMails.length === 0;
  const filteredMails = [...sentMails].filter(
    (mail) => mail.trashed === true
  );

  const content = (
    <div className="text-center mt-5">
      {" "}
      <h5>No sent messages!</h5>
      <Link to="/mailboxeditor">
        <span>Send</span>
      </Link>{" "}
      one now!
    </div>
  );

  return (
    <div style={{width:"calc(100% - 350px)", left:"300px",top:"0", position:"fixed"}}>
      <div className="border-bottom d-flex align-items-center py-2 px-1">
        <Selector filteredMails={filteredMails} />
        
      </div>
      {isLoading ? (
        <div className=" d-flex h-50 justify-content-center align-items-center">
          <LoadingSpinner />
        </div>
      ) : isDeleteEnabled ? (
        content
      ) : (
        <ListGroup variant="flush" className="">
          {sentMails.map((mail) => (
            <MailListItems mail={mail} key={mail.id} />
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Sent;