import React, { Fragment, useEffect, useState, useCallback, useRef } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Cookies from 'universal-cookie';
import Button from 'react-bootstrap/Button';
import { useAuth } from './auth';
import { Conversation } from "./Conversation";
import Modal from 'react-bootstrap/Modal';

export default function Messages() {

  const [nbMessages, setNbMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState(1);

  const auth = useAuth();
  var cookie = new Cookies();
  const [idUser, setIdUser] = useState(null);

  const [friends, setFriends] = useState([]);

  useEffect(() => {

    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState == XMLHttpRequest.DONE) {
        setFriends(JSON.parse(request.responseText)[0].following);
      } else {
        console.error(request.statusText);
      }
    }
    request.open("GET", 'http://localhost:5000/users/friends', false);
    request.setRequestHeader('Authorization', 'Bearer ' + cookie.get('token'));
    request.send();

  }, [setFriends]);


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

  const [show, setShow] = useState(false);
  const [idUserTo, setIdUserTo] = useState(null);
  const [displayConv, setDisplayConv] = useState("d-none");
  const handleClose = () => {setShow(false); setContentConv("");
  setDisplayConv("d-none")};
  const handleShow = () => (setShow(true));
  const handledisplay = () => (setDisplayConv());

  const createConv = (e) => {
    setIdUserTo(e.target.value);
    handledisplay()
  }




  const [contentConv, setContentConv] = useState("");
  const contentRefConv = useRef(null);
  const updateContentConv = ({ target: { value } }) => setContentConv(value);

  const onFormSubmitConv = event => {
    const request = new XMLHttpRequest();
    event.preventDefault();
    if (contentConv == "") {
      contentRefConv.current.focus();
      console.log("Erreur dans le contenu du message");
    } else {
      request.open("POST", 'http://localhost:5000/messages/', false); //false for synchronous request
      request.setRequestHeader('Authorization', 'Bearer ' + cookie.get('token'));
      request.setRequestHeader("Content-type", "application/json");
      request.send(JSON.stringify({
        "content": contentConv,
        "status": 1,
        "from": auth.user.id,
        "to": idUserTo
      }));
      
      const newConv = {
        "content": contentConv,
        "status": 1,
        "from": auth.user.id,
        "to": idUserTo
      }
      
      setNbMessages(nbMessages => [...nbMessages, newConv]);
      setContentConv("");
      setDisplayConv("d-none");
      handleClose()
    }
  }

  return (
    <Fragment>
      <Container>
        <Row>
          <Row>
            <Col>
              <h2>Mes Messages</h2>
              <Button onClick={() => (handleShow())}> Nouvelle conversation</Button>
              <hr />
              <div id="mesMessages">
                {
                  friends.map(message => {

                    if (auth.user.id != message.id) {
                      return (
                        <div className="d-flex mt-2" key={message.id}>
                          <Button variant="primary" onClick={() => setValue(message.id)}>{message.firstname}</Button>
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
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Création d'une nouvelle conversation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="input-group mb-3">
              <select className="form-control" onChange={createConv}>
                <option>Choisissez un amis</option>
                {
                  friends.map(friend => {
                    if (friend.id != auth.user.id) {
                      return (
                        <option key={friend.id} value={friend.id} onClick={(e) => console.log("eee0")}>{friend.firstname}</option>
                      );
                    }
                  }
                  )
                }
              </select>
              
            </div>
            <form onSubmit={onFormSubmitConv}>
              <hr/>
                <Row className={displayConv}>
                  <input className="form-control" placeholder="Saisir le message" type="text" value={contentConv} onChange={updateContentConv} ref={contentRefConv} />
                  <p id="errorContent"></p>
                  <Button variant="primary" type="submit">Envoyer</Button>
                </Row>
              </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Fragment>
  );
}