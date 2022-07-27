import React, {Fragment, useCallback, useEffect, useState} from "react";
import Sidebar from "./Sidebar";
import Cookies from "universal-cookie";
import {Alert, Button, Card, Col, Row} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import {BsFillPersonXFill, BsFillTrashFill, BsTelegram} from "react-icons/bs";
import {useAuth} from "../auth";

export default function ShowUser() {

    let [user, setUser] = useState([]);
    const [status, setStatus] = useState(0);
    const [statusText, setStatusText] = useState("");
    const [message, setMessage] = useState("");
    const [alert, setAlert] = useState("");
    const cookies = new Cookies();
    const params = useParams();
    const auth = useAuth();

    const onFormSubmit = event => {
        setAlert("Message : '" + message + "' envoyé à " + user.firstname + " " + user.email);
        event.preventDefault();
    }

    const myHeaders = new Headers();
    myHeaders.set('Authorization', "Bearer " + cookies.get('token'));

    const myInit = {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };

    useEffect(() => {
        const fetchData = () => {
            fetch(`http://localhost:5000/admin/show-user/${params.id}`, myInit)
                .then((response) => {
                    setStatus(response.status);
                    setStatusText(response.statusText);
                    return response.json();
                })
                .then((data) => {
                    setUser(data);
                });
        };
        fetchData();
    }, []);

    const deactivate = useCallback(() => {
        myHeaders.set('Accept', 'application/json');
        myHeaders.set('Content-Type', 'application/json');
        const deleteUserHeaders = {
            method: 'PUT',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify({status: "-1"})
        };
        const deleteUser = () => {
            fetch(`http://localhost:5000/admin/delete-user/${params.id}`, deleteUserHeaders)
                .then(x => console.log(x))
        }
        deleteUser();
    }, []);

    const ban = useCallback(() => {
        myHeaders.set('Accept', 'application/json');
        myHeaders.set('Content-Type', 'application/json');
        const deleteUserHeaders = {
            method: 'PUT',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify({status: "-2"})
        };
        const deleteUser = () => {
            fetch(`http://localhost:5000/admin/delete-user/${params.id}`, deleteUserHeaders)
                .then(res => res.json())
                .then(data => {
                    setStatus(data.status);
                    setStatusText(data.statusText);
                })
        }
        deleteUser();
    }, []);

    const sendMsg = useCallback(() => {
        myHeaders.set('Accept', 'application/json');
        myHeaders.set('Content-Type', 'application/json');
        const postMessageHeaders = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify({
                content: message,
                status: 1,
                from: auth.user.id,
                to: user.id,
                isWarning: true
            })
        };

        const sendMessage = () => {
            fetch(`http://localhost:5000/admin/warn-user`, postMessageHeaders)
                .then(data => {
                    setStatus(data.status);
                    setStatusText(data.statusText);
                })
        }
        sendMessage();
    }, [message, auth, user]);


    return (
        <Fragment>
            <Row>
                <Col md="4">
                    <Sidebar/>
                </Col>
                <Col md="8">
                    <Card style={{width: '50rem'}}>
                        <Card.Body>
                            <Card.Title>{user?.firstname}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{user?.email}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">{user?.isAdmin ? "Administrateur" : "Utilisateur standard" }</Card.Subtitle>
                            <Button onClick={() => deactivate()} className="btn btn-danger">
                                <BsFillTrashFill/>
                            </Button>
                            <Button onClick={() => ban()} className="btn btn-warning">
                                <BsFillPersonXFill/>
                            </Button>

                            <Card.Title>Envoyer un message</Card.Title>
                            {   alert !== "" && status === 201?
                                <Alert key="success" variant="success" className="mt-1">
                                    {alert}
                                </Alert> : ''
                            }
                            <form onSubmit={onFormSubmit}>
                                <input onChange={(e) => {
                                    setMessage(e.target.value);
                                }}/>

                                <Button type={"submit"} onClick={() => sendMsg()}
                                        className="btn btn-primary"><BsTelegram/></Button>
                            </form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
}