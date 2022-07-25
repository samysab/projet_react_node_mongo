import React, {Fragment, useCallback, useEffect, useState} from "react";
import Sidebar from "./Sidebar";
import Cookies from "universal-cookie";
import {Button, Card, Col, Container, Row, Table} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";

export default function ShowUser() {

    const [user, setUser] = useState([]);
    const [status, setStatus] = useState(0);
    const [statusText, setStatusText] = useState("");
    const cookies = new Cookies();
    const params = useParams();


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
                .then((data) => setUser(data));
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
                            <Button onClick={ () => deactivate()} className="btn btn-warning">Désactiver le compte</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
}