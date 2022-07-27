import React, {Fragment, useCallback, useEffect, useState} from "react";
import Sidebar from "./Sidebar";
import Cookies from "universal-cookie";
import {Button, Col, Container, Row, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import {BsFillPersonXFill, BsFillTrashFill, BsTelegram} from "react-icons/bs";

export default function MessageManagement() {

    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState(0);
    const [statusText, setStatusText] = useState("");
    const cookies = new Cookies();

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
            fetch(`http://localhost:5000/messages`, myInit)
                .then((response) => {
                    setStatus(response.status);
                    setStatusText(response.statusText);
                    return response.json();
                })
                .then((data) => setMessages(data));
        };
        fetchData();
    }, []);

    const ban = useCallback((id) => {
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
            fetch(`http://localhost:5000/admin/delete-user/${id}`, deleteUserHeaders)
                .then(res => res.json())
                .then(data => {
                    setStatus(data.status);
                    setStatusText(data.statusText);
                })
        }
        deleteUser();
    }, []);

    const deleteMessage = useCallback((id) => {
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
            fetch(`http://localhost:5000/admin/delete-message/${id}`, deleteUserHeaders)
                .then(res => res.json())
                .then(data => {
                    setStatus(data.status);
                    setStatusText(data.statusText);
                })
        }
        deleteUser();
    }, []);

    return (
        <Fragment>
            <Container className="m-0">
                <Row>
                    <Col className={"p-0"} md={3}>
                        <Sidebar/>
                    </Col>
                    <Col md={9}>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                messages.map(message => {
                                    return (

                                        <tr key={message.idmess}
                                            className={message.isWarning ? "alert alert-warning" : ""}>
                                            <td>
                                                <p>{message.idmess}</p>
                                                <p>Contenu du message: "{message.content}"</p>
                                                <p>Statut : {message.msgstatus}</p>
                                                <p>From : {message.userfrom}</p>
                                                <p>To : {message.userto}</p>
                                            </td>
                                            <td>
                                                <Button onClick={() => deleteMessage(message.idmess)} className="btn btn-danger">
                                                    <BsFillTrashFill/>
                                                </Button>
                                                <Button onClick={() => ban(message.from)} className="btn btn-warning">
                                                    Bannir l'expéditeur ({message.userfrom}) <BsFillPersonXFill/>
                                                </Button>
                                            </td>
                                        </tr>

                                    );
                                })
                            }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}