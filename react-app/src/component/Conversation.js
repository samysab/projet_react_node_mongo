import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import Row from 'react-bootstrap/Row';
import Cookies from 'universal-cookie';
import Button from 'react-bootstrap/Button';
import { useAuth } from './auth';
import Alert from 'react-bootstrap/Alert';
import './css/conversation.css';
var moment = require('moment'); // require


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
  const [idMessage, setIdMessage] = useState("");
  const [deleted, setDeleted] = useState(false);

  useEffect(
    () => {
      request.open("PUT", 'http://localhost:5000/messages/changeStatus/' + idMessage, false); //false for synchronous request
      request.setRequestHeader('Authorization', 'Bearer ' + cookie.get('token'));
      request.setRequestHeader("Content-type", "application/json");
      request.send(JSON.stringify({}));

      if (request.response === true) {
        console.log("Erreur lors de la suppression du message");
      } else {
        setDeleted(idMessage)
      }
    },
    [idMessage]
  );

  const [paraToInput, setParaToInput] = useState(false);
  const [contentModified, setContentModified] = useState(["", ""]);
  const [modifiedAt, setModifiedAt] = useState(["", ""]);
  const [messageModify, setMessageModify] = useState(["", ""]);
  const modifyContent = ({ target: { value } }) => setMessageModify(value);
  const modifycontentRef = useRef(null);


  const onBlurModify = event => {
    if (messageModify == "" || messageModify == ",") {
      contentRef.current.focus();
      console.log("Erreur dans le contenu du message");
    } else {
      setAlert(false);

      request.open("PUT", 'http://localhost:5000/messages/'+event.target.dataset.id, false); //false for synchronous request
      request.setRequestHeader('Authorization', 'Bearer ' + cookie.get('token'));
      request.setRequestHeader("Content-type", "application/json");
      request.send(JSON.stringify({
        "content": messageModify
      }));
      if (JSON.parse(request.response).success === true) {
        setAlert(false);
        setModifiedAt(["",""])
        setContentModified(["", ""])

      } else {
        setAlert(false);
        setContentModified([event.target.dataset.id, messageModify]);
        setModifiedAt([event.target.dataset.id, moment().format('DD/MM/YYYY HH:mm:ss')]);
        setParaToInput(null);
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
                <Fragment>
                  <p key={message.id} className={(message.from == auth.user.id ? "from-me" : "from-them")}>
                    {(paraToInput != message.id ? <p id={"message_" + message.id}>{(!message.status || idMessage == message.id ? "/!\\ Ce message a été supprimer" :(contentModified[0] != message.id ? message.content : contentModified[1])  )}</p> : <input value={messageModify} data-id={message.id} onChange={(modifyContent)} onBlur={onBlurModify} ref={modifycontentRef} />)}
                    
                    {(!message.status || idMessage == message.id || auth.user.id != message.from ? "" : <Button onClick={() => setIdMessage(message.id)}>Supprimer</Button>)}
                    {(message.status || auth.user.id != message.from ? <Button onClick={() => setParaToInput(message.id)}>Modifier</Button> : "" )}
                    

                    <br /><small style={{ fontSize: "15px" }} className={(message.from == auth.user.id ? "from-me" : "from-them")}>{( message.createdAt != message.updatedAt ? (modifiedAt[0] == message.id  ? modifiedAt[1] :"Modifié le "+moment(message.updatedAt).format('DD/MM/YYYY hh:mm:ss') ) : moment(message.createdAt).format('DD/MM/YYYY hh:mm:ss')) }</small>
                  </p>
                </Fragment>
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
