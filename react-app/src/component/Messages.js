import React, {Fragment, useEffect, useState, useCallback} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Cookies from 'universal-cookie';
import Button from 'react-bootstrap/Button';

import {BrowserRouter as Router,Link,useParams} from "react-router-dom";

const request = new XMLHttpRequest();

export default function Messages() {

  const [nbMessages, setNbMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState(1);

useEffect(() => {

  const request = new XMLHttpRequest();
  request.onreadystatechange = function() {
      if (request.readyState == XMLHttpRequest.DONE) {
        setNbMessages(JSON.parse(request.responseText));
      }
  }
  request.open( "GET", 'http://localhost:5000/messages/', false );
  request.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RuYW1lIjoiT0siLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjU4MzM4MTczLCJleHAiOjE2ODk4OTU3NzN9.NmuWfiL7Gf4qdTuxpXhkaiNdsOJhZKvt5SsNyM5cu6E');
  request.send();

}, [setNbMessages]);

useEffect(() => {
  
  const request = new XMLHttpRequest();
  console.log("111111111111");
  request.onreadystatechange = function() {
      if (request.readyState == XMLHttpRequest.DONE) {
        setMessages(JSON.parse(request.responseText));
      }
  }
  console.log("________________________________ " + value);
  request.open( "GET", 'http://localhost:5000/messages/getAllMessagesPerUser/'+value, false );
  request.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RuYW1lIjoiT0siLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjU4MzM4MTczLCJleHAiOjE2ODk4OTU3NzN9.NmuWfiL7Gf4qdTuxpXhkaiNdsOJhZKvt5SsNyM5cu6E');
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
                        nbMessages.map( message => {
                          console.log(message);
                            return (
                            <div className="d-flex mt-2" key={message.from}> 
                              {/* <Link to={`${message.from}`}>{message.from}</Link> */}
                              <Button variant="primary" onClick={() => setValue(message.from)}>{message.from}</Button>
                            </div>
                            );
                        })
                    }
                    </div>
                  </Col>
                  <Col id="test">
                      <div>
                      {
                        messages.map( message => {
                            return (
                            <div className="d-flex mt-2" key={message.id}> 
                                <span>from {message.from} - to {message.to} {message.content}</span>
                            </div>
                          
                            );
                        })
                      }
                      </div>
                  </Col>
                </Row>
            </Row>
          </Container>
      </Fragment>
  );
}