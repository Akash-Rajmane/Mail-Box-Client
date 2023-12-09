import { ListGroup, Row, Col, Form } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setRead, toggleStarred, setChecked } from "../../store/mailSlice";

import axios from "axios";
import { useState } from "react";

const MailListItems = (props) => {
  const { mail } = props;
  const location = useLocation();
  
  const dispatch = useDispatch();

  const onCheckHandler = () => {
    dispatch(setChecked({ id: mail.id, selector: "single" }));
  };

  const [isHovered, setIsHovered] = useState(false);

  const [starHovered, setStarHovered] = useState(false);
  
  const starMouseEnter = () => {
    setStarHovered(true);
  };
  
  const starMouseLeave = () => {
    setStarHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const starClickHandler = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(toggleStarred({ id: mail.id }));
    try {
      const response = await axios.put(
        `https://mail-box-client-46880-default-rtdb.firebaseio.com/emails/${mail.id}.json`,
        {
          ...mail,
          starred: !mail.starred,
          isChecked: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      //const data = response.data;

      if (response.status === 200) {
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const onClickHandler = async () => {
    dispatch(setChecked({ id: null, selector: "none" }));
    if (!mail.hasRead) {
      try {
        const response = await axios.put(
          `https://mail-box-client-46880-default-rtdb.firebaseio.com/emails/${mail.id}.json`,
          {
            ...mail,
            hasRead: true,
            isChecked: false,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        //const data = response.data;

        if (response.status === 200) {
          dispatch(setRead({ id: mail.id }));
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };


  const sentOnClickHandler = () => {
   
  }



  return (
    <ListGroup.Item
      action
      as={Link}
      to={ location.pathname === "/home"
      ? `/home/${mail.id}` 
      : location.pathname === "/trash" 
      ? `/trash/${mail.id}`
      : location.pathname === "/sent"
      ? `/sent/${mail.id}`
      :`starred/${mail.id}`}
      className={`mb-1 border-bottom ${
        mail.isChecked ? "bg-success bg-opacity-25" : ""
      } ${isHovered ? "shadow-sm" : ""}`}
      onClick={onClickHandler}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
  <Row>
        <Col lg="3">
          <div className="d-flex">
            <Form>
              <Form.Check
                checked={mail.isChecked}
                onChange={location.pathname === "/sent" ? sentOnClickHandler:onCheckHandler}
                onClick={(e) => e.stopPropagation()} 
              />
            </Form>
            <div className="" style={{ cursor: "auto" }}>
              {mail.starred ? (
                <i
                className={`bi bi-star-fill text-warning px-1 ms-2 ${
                  starHovered ? "bg-secondary rounded bg-opacity-10" : ""
                }`}
                  onClick={starClickHandler}
                  onMouseEnter={starMouseEnter}
                  onMouseLeave={starMouseLeave}
                />
              ) : (
                <i
                className={`bi bi-star  px-1 ms-2 ${
                  starHovered ? "bg-secondary rounded bg-opacity-10" : ""
                }`}
                  onClick={starClickHandler}
                  onMouseEnter={starMouseEnter}
                  onMouseLeave={starMouseLeave}
                />
              )}
            </div>

            <p className="fw-bold ps-3">
              <i
                className={`bi ${
                  mail.hasRead ? "invisible" : ""
                } bi-record-fill text-primary pe-1`}

                style={{ display: location.pathname === "/sent" ? "none" : "" }}
              ></i>
              {mail.sender}
            </p>
          </div>{" "}
        </Col>
        <Col lg="7">
          <div>
            <span className="fw-bold">{mail.subject}</span>
            <span className="ps-2">
              {mail.emailContent?.blocks[0].text}
            </span>
          </div>
        </Col>
        <Col></Col>
      </Row>
    </ListGroup.Item>
  );
};

export default MailListItems;