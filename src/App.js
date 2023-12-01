import { useEffect } from 'react';
import './App.css';
import Auth from './components/Auth';
import { Routes, Route, useLocation } from 'react-router-dom';
import { addToInbox, clearInbox, setMailsLoading } from "./store/mailSlice";
import { addToSentBox, clearSentBox } from "./store/sentMailsSlice";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import Inbox from "./components/Mailbox/Inbox";
import Message from "./components/Mailbox/Message";
import MailboxEditor from "./components/Mailbox/MailboxEditor";
import Sidbar from './components/Sidbar';
import Trash from "./components/Mailbox/Trash"
import Sent from './components/Mailbox/Sent';


function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  //const auth = useSelector((state) => state.auth.isAuthenticated);
  const recipientMail = useSelector((state) => state.auth.email);
  const email = recipientMail.replace(/[.]/g, "");


  useEffect(() => {
    dispatch(setMailsLoading(true));

    const getEmails = async () => {
      try {
        const url1 =
          "https://mail-box-client-46880-default-rtdb.firebaseio.com/emails.json";
        const url2 = `https://mail-box-client-46880-default-rtdb.firebaseio.com/sent-emails/${email}.json`;

        const requests = [axios.get(url1), axios.get(url2)];

        const responses = await Promise.all(requests);
        const [response1, response2] = responses;
        const { data: receivedMails, status: status1 } = response1;
        const { data: sentMails, status: status2 } = response2;

        if (status1 === 200 && status2 === 200) {
          let arr1 = [];
          for (const key in receivedMails) {
            const mailItem = {
              id: key,
              isChecked: false,
              ...receivedMails[key],
            };
            if (mailItem.recipient === recipientMail) {
              arr1.push(mailItem);
            }
          }
          dispatch(addToInbox(arr1));
          for (const key in sentMails) {
            const sentMailItem = {
              id: key,
              isChecked: false,
              ...sentMails[key],
            };
            dispatch(addToSentBox(sentMailItem));
            
          }
         
        }
      } catch (e) {
        console.log(e.message);
      } finally {
        dispatch(setMailsLoading(false));
      }
    };
    if (email) {
      getEmails();
    }

    return () => {
      dispatch(clearInbox());
      dispatch(clearSentBox());
    };
  }, [email, dispatch, recipientMail]);

  return (
    <div className="App">
      {location.pathname!=="/"&& <Sidbar/>}
      <Routes>
        <Route path="/" element={<Auth/>}/>
        <Route path="/mailboxeditor" element ={ <MailboxEditor />}/> 
        <Route path="/home/:messageId" element={ <Message />}/>
        <Route path="/home" element={<Inbox/>} />
        <Route path="/trash" element={<Trash/>}/>
        <Route path="/trash/:messageId" element={ <Message />}/>
        <Route path="/sent" element={<Sent/>}/>
        <Route path="/sent/:messageId" element={ <Message />}/>
      </Routes>
    </div>
  );
}

export default App;
