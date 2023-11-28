import { useEffect } from 'react';
import './App.css';
import Auth from './components/Auth';
import Home from "./pages/Home";
import { Routes, Route } from 'react-router-dom';
import { addToInbox } from "./store/mailSlice";
import axios from "axios";
import { useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const getEmails = async () => {
      try {
        const response = await axios.get(
          "https://react-mailbox-client-4f470-default-rtdb.firebaseio.com/emails.json",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;
        if (response.status === 200) {
          for (const key in data) {
            const mailItem = { id: key, isChecked: false, ...data[key] };
            dispatch(addToInbox(mailItem));
          }
        }
      } catch (e) {
        console.log(e.message);
      }
    };
    getEmails();
  }, [dispatch]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Auth/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
    </div>
  );
}

export default App;
