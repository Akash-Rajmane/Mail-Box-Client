import { useEffect } from 'react';
import './App.css';
import Auth from './components/Auth';
import { Routes, Route, useLocation } from 'react-router-dom';
import { addToInbox } from "./store/mailSlice";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import Inbox from "./components/Mailbox/Inbox";
import Message from "./components/Mailbox/Message";
import MailboxEditor from "./components/Mailbox/MailboxEditor";
import Sidbar from './components/Sidbar';


function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const email = useSelector((state) => state.auth.email);

  useEffect(() => {
    const getEmails = async () => {
      try {
        const response = await axios.get(
          "https://mail-box-client-46880-default-rtdb.firebaseio.com/emails.json",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;
        if (response.status === 200) {
          let arr = [];
          for (const key in data) {
            const mailItem = { id: key, isChecked: false, ...data[key] };
            arr.push(mailItem);
          }
          dispatch(addToInbox(arr));
        }
      } catch (e) {
        console.log(e.message);
      }
    };
    getEmails();

    if (email) {
      getEmails();
    }
  }, [dispatch, email]);

  return (
    <div className="App">
      {location.pathname!=="/"&& <Sidbar/>}
      <Routes>
        <Route path="/" element={<Auth/>}/>
        <Route path="/mailboxeditor" element ={ <MailboxEditor />}/> 
        <Route path="/home/:messageId" element={ <Message />}/>
        <Route path="/home" element={<Inbox/>} />
        <Route path="/trash"></Route>
        <Route path="/sent"></Route>
      </Routes>
    </div>
  );
}

export default App;
