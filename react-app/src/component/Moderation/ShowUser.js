import React, {Fragment, useCallback, useEffect, useState} from "react";
import Sidebar from "./Sidebar";
import Cookies from "universal-cookie";
import {Button, Card, Col, Row} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import {BsFillPersonXFill, BsFillTrashFill} from "react-icons/bs";
import {useAuth} from "../auth";

export default function ShowUser() {

    let [user, setUser] = useState([]);
    const [status, setStatus] = useState(0);
    const [statusText, setStatusText] = useState("");
    const [message, setMessage] = useState("");
    const cookies = new Cookies();
    const params = useParams();
    const auth = useAuth();

    const handleChange = (event) => {
        setMessage(event.target.value);
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
                .then(x => console.log(x))
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
            body: {
                "content": message,
                "status": true,
                "from": auth.user.id,
                "to": user.id
            }
        };

        const sendMessage = () => {
            fetch(`http://localhost:5000/admin/warn-user`, postMessageHeaders)
                .then(x => console.log(x))
        }
        sendMessage();
    }, []);


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
                            <Card.Subtitle className="mb-2 text-muted">{user?.status}</Card.Subtitle>
                            <Button onClick={() => deactivate()} className="btn btn-danger">
                               <BsFillTrashFill/>
                            </Button>
                            <Button onClick={() => ban()} className="btn btn-warning">
                                <BsFillPersonXFill/>
                            </Button>

                            <Card.Title>Envoyer un message</Card.Title>
                            <input value={message} onChange={handleChange}/>

                            <Button onClick={() => sendMsg()} className="btn btn-primary">Envoyer un
                                message</Button>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
}