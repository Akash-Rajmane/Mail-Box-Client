import React, { useState, useRef } from "react";
import {
    Form,
    Button,
    FloatingLabel,
    Container,
    Row,
    Col,
  } from "react-bootstrap";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Notification from "./UI/Notification";
import { showNotification, setIsLoading, login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./UI/LoadingSpinner";

const Auth = () => {
    const isLoading = useSelector((state) => state.auth.isLoading);
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const dispatch = useDispatch();
    const { message, variant } = useSelector((state) => state.auth.notification);
    const [signIn, setSignIn] = useState(true);
    const navigate = useNavigate();
  
    const onClickHandler = () => {
        setSignIn(!signIn);
        dispatch(showNotification({ message: null, variant: null }));
      };
    
      const onSubmitHandler = async (e) => {
        try {
          e.preventDefault();
          dispatch(setIsLoading(true));
          const enteredEmail = emailRef.current.value.trim();
          const enteredPassword = passwordRef.current.value.trim();
    
          if (!signIn) {
            const enteredConfirmPassword = confirmPasswordRef.current.value;
            if (enteredPassword !== enteredConfirmPassword) {
              dispatch(
                showNotification({
                  message: "Passwords don't match",
                  variant: "danger",
                })
              );
              dispatch(setIsLoading(false));
              return;
            }
          }
    
          const endPointUrl = signIn
            ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_API_KEY}`
            : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_API_KEY}`;
    
          const response = await axios.post(
            endPointUrl,
            {
              email: enteredEmail,
              password: enteredPassword,
              returnSecureToken: true,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = response.data;
          if (response.status === 200) {
            if (signIn) {
                dispatch(showNotification({ message: null, variant: null }));
                dispatch(login({ idToken: data.idToken, email: data.email }));
                navigate("/home");
            } else {
                const message = "Welcome, you can now login with your credentials";
                dispatch(showNotification({ message: message, variant: "success" }));
            }
          }
        } catch (error) {
          const errorMessage = error.response.data.error.message;
          dispatch(showNotification({ message: errorMessage, variant: "danger" }));
        } finally {
          dispatch(setIsLoading(false));
        }
      };


      const resetPasswordHandler = async () => {
        let email = emailRef.current.value;
        if(email==="" || !email.includes("@") || !email.includes(".com")){
          alert("Please enter valid email address");
          return;
        }
        try{
          const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.REACT_APP_API_KEY}`,
          {
            email,
            requestType: "PASSWORD_RESET"
          },
          {  headers: {
                "Content-Type":"application/json"
            }
          });
  
          if(response.status === 200){
            console.log(response);
            alert("Link to reset your password is sent to your mail");
          }
        }catch(error){
          console.log(error.response.data.error.message);
        }
      } 
  
    
  
    return (
        <Container fluid>
        <Row className="justify-content-center">
          {message && <Notification message={message} variant={variant} />}
          <Col className="mt-5">
            <div
              style={{ maxWidth: "25rem" }}
              className="text-center mt-5 border bg-info bg-gradient mx-auto rounded-top py-4"
            >
              <h4 className="fw-bold"> {signIn ? "Login" : "Sign Up"}</h4>
            </div>
            <Form
              onSubmit={onSubmitHandler}
              className="p-4  shadow-lg mx-auto "
              style={{ maxWidth: "25rem" }}
            >
              <FloatingLabel
                controlId="floatingInput"
                label="Email address"
                className="mb-3"
              >
                <Form.Control
                  className="border-0 border-bottom rounded-0"
                  type="email"
                  placeholder="name@example.com"
                  ref={emailRef}
                  required
                />
              </FloatingLabel>
              <FloatingLabel
                className="mb-3"
                controlId="floatingPassword"
                label="Password"
              >
                <Form.Control
                  className="border-0 border-bottom rounded-0"
                  type="password"
                  placeholder="Password"
                  ref={passwordRef}
                  required
                />
              </FloatingLabel>
              {!signIn && (
                <FloatingLabel
                  controlId="floatingConfirmPassword"
                  label="Confirm Password"
                >
                  <Form.Control
                    className="border-0 border-bottom rounded-0"
                    type="password"
                    placeholder="Password"
                    ref={confirmPasswordRef}
                    required
                  />
                </FloatingLabel>
              )}
              <div className="text-center mt-4">
                {signIn ? (
                  <Button
                    type="submit"
                    className="w-100 mt-2 bg-primary bg-gradient rounded-0"
                  >
                    {isLoading ? <LoadingSpinner /> : "Login"}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-100 mt-2 bg-primary bg-gradient rounded-0"
                  >
                    {isLoading ? <LoadingSpinner /> : "Sign Up"}
                  </Button>
                )}
                {signIn && <p className="text-decoration-underline mt-4 fw-bold" onClick={resetPasswordHandler}>Forgot Password</p>}
              </div>
              <div className="pt-3 text-center">
                <span className="">
                  {!signIn ? "Already a user?" : "First Time?"}{" "}
                  <span
                    onClick={onClickHandler}
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    {!signIn ? "Login" : "Sign Up"}
                  </span>{" "}
                </span>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  };
  
  export default Auth;