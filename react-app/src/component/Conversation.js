import React, { Fragment, useEffect, useState, useRef } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Cookies from 'universal-cookie';
import Button from 'react-bootstrap/Button';
import { useAuth } from './auth';
import Alert from 'react-bootstrap/Alert';
import './css/conversation.css';
const request = new XMLHttpRequest();

export function Conversation({ to, messages }) {

  const auth = useAuth();
  var cookie = new Cookies();

  const [content, setContent] = useState("");
  const contentRef = useRef(null);
  const [alert, setAlert] = useState(false);

  const updateContent = ({ target: { value } }) => setContent(value);

  const onFormSubmit = event => {
    event.preventDefault();
    if (content == "") {
      setAlert(true);
      contentRef.current.focus();
      console.log("Erreur dans le contenu du message");
    } else {
      setContent("");
      setAlert(false);

      request.open("POST", 'http://localhost:5000/messages/', false); //false for synchronous request
      request.setRequestHeader('Authorization', 'Bearer ' + cookie.get('token'));
      request.setRequestHeader("Content-type", "application/json");
      request.send(JSON.stringify({
        "content": content,
        "status": 1,
        "from": auth.user.id,
        "to": to
      }));

      if (JSON.parse(request.response).success === true) {
        setAlert(false);
      } else {
        setAlert(false);
        messages.push(JSON.parse(request.response));
      }
    }
  }

  return (
    <Fragment>
      <div className="imessage">
        {
          messages.map(message => {
            if ((to == message.from || to == message.to) && (auth.user.id == message.from || auth.user.id == message.to)) {
              return (
                <p key={message.id} className={(message.from == auth.user.id ? "from-me" : "from-them")}>
                  {message.content}
                </p>
              );
            }
          })
        }
      </div>
      <form onSubmit={onFormSubmit}>
        <Row>
          <input type="text" value={content} onChange={updateContent} ref={contentRef} />
          <p id="errorContent"></p>
          <Button variant="primary" type="submit">Envoyer</Button>
        </Row>
      </form>
      {alert ?
        <Alert key="danger" variant="danger" className="mt-1">
          Le contenu du message ne peux pas être vide
        </Alert> : ''
      }
    </Fragment>

  );
}
