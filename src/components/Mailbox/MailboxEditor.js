import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Container, Form, Button, InputGroup } from "react-bootstrap";
import { useRef, useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { useSelector, useDispatch } from "react-redux";
import Notification from "../UI/Notification";
import { showNotification } from "../../store/authSlice";
import { addToSentBox } from "../../store/sentMailsSlice";
import axios from "axios";

const MailboxEditor = () => {
  const toRef = useRef();
  const subjectRef = useRef();
  const mailSender = useSelector((state) => state.auth.email);
  const email = mailSender.replace(/[.]/g, "");
  const { message, variant } = useSelector((state) => state.auth.notification);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  
  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  

  const onSubmitHandler = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const to = toRef.current.value;
    const mailSubject = subjectRef.current.value;
    const editorContent = convertToRaw(editorState.getCurrentContent());

    const emailInfo = {
      recipient: to,
      subject: mailSubject,
      emailContent: editorContent,
      sender: mailSender,
      isChecked: false,
      hasRead: false,
      trashed: false,
      starred: false,
    };
   
    try {
      const url1 =
        "https://mail-box-client-46880-default-rtdb.firebaseio.com/emails.json";
      const url2 = `https://mail-box-client-46880-default-rtdb.firebaseio.com/sent-emails/${email}.json`;

      const requests = [
        axios.post(url1, emailInfo),
        axios.post(url2, emailInfo),
      ];

      const responses = await Promise.all(requests);
      const [response1, response2] = responses;
      const { status: status1 } = response1;
      const { data, status: status2 } = response2;

      if (status1 === 200 && status2 === 200) {
        dispatch(showNotification({ message: "Sent", variant: "success" }));
        const mailItem = {
          id: data.name,
          isChecked: false,
          ...emailInfo,
        };
        dispatch(addToSentBox(mailItem));
      }
     
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container style={{width:"calc(100% - 350px)", left:"300px",top:"0", position:"fixed"}}>
      {message && (
        <div
          style={{ maxWidth: "20rem" }}
          className="fixed-top ms-auto mt-2 me-3"
        >
          <Notification message={message} variant={variant} />
        </div>
      )}
      <Form onSubmit={onSubmitHandler} className="p-3">
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">To</InputGroup.Text>
          <Form.Control
            placeholder="example@gmail.com"
            aria-label="Username"
            aria-describedby="basic-addon1"
            ref={toRef}
            required
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon2">Subject</InputGroup.Text>
          <Form.Control
            placeholder=""
            aria-label="subject"
            aria-describedby="basic-addon2"
            ref={subjectRef}
            required
          />
        </InputGroup>
        <Form.Group className="mb-3" controlId="textEditor">
          <Editor
            toolbarClassName="py-3 border-bottom bg-light"
            wrapperClassName="card mt-3"
            editorClassName="card-body pt-0 "
            editorStyle={{ minHeight: "20rem" }}
            editorState={editorState}
            onEditorStateChange={handleEditorStateChange}
            options={{}}
          />
        </Form.Group>
        <div>
          <Button
            type="submit"
            variant="secondary "
            className="bg-gradient shadow rounded-0 px-4"
          >
            {isLoading ? "Sending" : "Send"}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default MailboxEditor;