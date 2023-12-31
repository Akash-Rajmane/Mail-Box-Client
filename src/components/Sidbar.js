import { NavLink } from "react-router-dom";
import {
  Row,
  Col,
  ButtonGroup,
  ToggleButton,
  Container,
  Offcanvas,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import Logout from "./Logout";


const Sidbar = () => {
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);
  const filteredMails = mails.filter(
    (mail) => mail.recipient === email && mail.trashed === false
  );
  let unread = 0;

  filteredMails.forEach((mail) => {
    if (!mail.hasRead) {
      unread++;
    }
  });





  return (
    <Container style={{width:"350px",left:"0",top:"0", position:"fixed"}}>
      <Row className="min-vh-100">
        <Col className="bg-dark d-flex flex-column p-0 pb-4" xs="auto">
          <Offcanvas
            className="p-lg-3 pb-2 bg-dark"
            responsive="sm"
           style={{ maxWidth: "100vw" }}
          >
            <Offcanvas.Body className="d-flex flex-column  p-lg-2">
              <div className="text-center">
                <i className="bi bi-envelope-at-fill text-danger fs-2"></i>
                <p className="ps-2 fs-4 fw-bold text-info">Mail Box Client</p>
              </div>
              <div className="text-start mt-5">
                <ButtonGroup className="d-flex h-100 text-light flex-column">
                  <NavLink to="/home">
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="rounded-0 w-100 text-start border-0 py-2 text-light"
                     
                    >
                      <div className="d-flex ">
                        <span>
                          <i className="fs-4 pe-2 bi bi-envelope-fill"></i>{" "}
                          Inbox
                        </span>
                        <span className="pt-2 pe-2 position-relative mx-auto">
                          unread
                          <span className="ps-1 position-absolute top-0 end-0 text-warning">
                            {unread}
                          </span>{" "}
                        </span>
                      </div>{" "}
                    </ToggleButton>
                  </NavLink>
                  <NavLink to="/sent" >
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="py-2 w-100 rounded-0 text-start border-0 text-light"
                    
                    >
                      <i className=" fs-4 pe-2 bi bi-send-check-fill"></i> Sent
                    </ToggleButton>
                  </NavLink>
                  <NavLink
                    to="/mailboxeditor"
                  >
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="py-2 w-100 border-0 rounded-0 text-start text-light"
                     
                    >
                      <i className="fs-4 pe-2 bi bi-envelope-plus-fill"></i>{" "}
                      Compose
                    </ToggleButton>
                  </NavLink>
                  <NavLink to="/trash" >
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="rounded-0 w-100 text-start py-2 border-0 text-light"
                    
                    >
                      <i className="fs-4 pe-2 bi bi-trash3"></i> Trash
                    </ToggleButton>
                  </NavLink>
                  <NavLink to="/starred" >
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="rounded-0 w-100 text-start py-2 border-0 text-light"
                    
                    >
                      <i className="bi fs-4 pe-2 bi-star-fill"></i> Starred
                    </ToggleButton>
                  </NavLink>
                </ButtonGroup>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
          <div className="mt-auto d-lg-block ms-4">
            <Logout />
          </div>
        </Col>
      
      </Row>
    </Container>
  );
};

export default Sidbar;