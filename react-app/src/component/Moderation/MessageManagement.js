import React, {Fragment, useCallback, useEffect, useState} from "react";
import Sidebar from "./Sidebar";
import Cookies from "universal-cookie";
import {Col, Row, Table} from "react-bootstrap";
import {Link} from "react-router-dom";

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

    return (
        <Fragment>
            <Row>
                <Col className="col col-md-4">
                    <Sidebar/>
                </Col>
                <Col className="col col-md-8">
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            messages.map( message => {
                                return (
                                    <tr key={message.id}>
                                        <td>
                                            <p>{message.id}</p>
                                            <p>{message.content}</p>
                                        </td>
                                        <td>
                                            <Link className="btn btn-primary" to={`/show-user/${message.id}`}>Voir le profil</Link>
                                        </td>
                                    </tr>

                                );
                            })
                        }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Fragment>
    );
}