import React, {Fragment, useCallback, useEffect, useState} from "react";
import Sidebar from "./Sidebar";
import Cookies from "universal-cookie";
import {Col, Container, Row, Table} from "react-bootstrap";
import {Link} from "react-router-dom";

export default function MessageManagement() {

    const [messages, setMessages] = useState([]);
    const [userFrom, setUserFrom] = useState([]);
    const [user, setUser] = useState([]);
    const [userTo, setUserTo] = useState([]);
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
        console.log(messages);
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
                                        <tr key={message.id} className={ message.msgstatus !== 1 ? "alert alert-warning" : ""}>
                                            <td>
                                                <p>{message.id}</p>
                                                <p>{message.content}</p>
                                                <p>Statut : {message.msgstatus !== -1 ? "Correct" : "Signalé"}</p>
                                                <p>From : {message.userfrom}</p>
                                                <p>To : {message.userto}</p>
                                            </td>
                                            <td>
                                                <Link className="btn btn-primary" to={`/show-message/${message.id}`}>Voir
                                                    le message</Link>
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