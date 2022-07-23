import React, { Fragment, useEffect, useState, useCallback } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Cookies from 'universal-cookie';
import Button from 'react-bootstrap/Button';
import { useAuth } from './auth';
import { BrowserRouter as Router, Link, useParams } from "react-router-dom";
import { Conversation } from "./Conversation";
const request = new XMLHttpRequest();

export default function Messages() {

  const [nbMessages, setNbMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState(1);

  const auth = useAuth();
  var cookie = new Cookies();

  useEffect(() => {

    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState == XMLHttpRequest.DONE) {
        setNbMessages(JSON.parse(request.responseText));
      }
    }
    request.open("GET", 'http://localhost:5000/messages/', false);
    request.setRequestHeader('Authorization', 'Bearer ' + cookie.get('token'));
    request.send();

  }, [setNbMessages]);

  useEffect(() => {

    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState == XMLHttpRequest.DONE) {
        setMessages(JSON.parse(request.responseText));
      }
    }
    request.open("GET", 'http://localhost:5000/messages/getAllMessagesPerUser/' + value, false);
    request.setRequestHeader('Authorization', 'Bearer ' + cookie.get('token'));
    request.send();

  }, [value]);

  return (
    <Fragment>
      <Container>
        <Row>
          <Row>
            <Col>
              <h2>Mes Messages</h2>
              <div>
                {
                  nbMessages.map(message => {
                    // console.log(message);
                    if (auth.user.id != message.from) {
                      return (
                        <div className="d-flex mt-2" key={message.from}>
                          <Button variant="primary" onClick={() => setValue(message.from)}>{message.from}</Button>
                        </div>
                      );
                    }

                  })
                }
              </div>
            </Col>
            <Col id="displayMessage">
              <div>
                <Row className="mt-4">
                </Row>
                <Conversation to={value} messages={messages} />
              </div>
            </Col>
          </Row>
        </Row>
      </Container>
    </Fragment>
  );
}