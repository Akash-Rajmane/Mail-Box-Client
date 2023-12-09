import Selector from "../Mailbox/Selector";
import { ListGroup } from "react-bootstrap";
import LoadingSpinner from "../UI/LoadingSpinner";
import MailListItems from "../Mailbox/MailListItems";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Sent = () => {
  const sentMails = useSelector((state) => state.sentMails.sentMails);
  const isLoading = useSelector((state) => state.mail.isLoading);
  const email = useSelector((state) => state.auth.email);
  const [filteredMails,setFilteredMails] = useState([]);
  const isDeleteEnabled = sentMails.length === 0;

  
  useEffect(()=>{
    let mails = [...sentMails].filter(
      (mail) => mail.trashed === true && mail.sender === email
    );
    setFilteredMails(mails);
  },[email,sentMails]);


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
          {sentMails.filter(mail=>mail.sender === email).map((mail) => (
            <MailListItems mail={mail} key={mail.id} />
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Sent;