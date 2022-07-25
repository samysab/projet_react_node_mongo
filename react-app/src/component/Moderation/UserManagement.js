import React, {Fragment, useCallback, useEffect, useState} from "react";
import Sidebar from "./Sidebar";
import Cookies from "universal-cookie";
import {Col, Container, Row, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import {BsFillPencilFill, BsFillPersonPlusFill} from "react-icons/bs";

export default function UserManagement() {

    const [users, setUsers] = useState([]);
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
            fetch(`http://localhost:5000/users`, myInit)
                .then((response) => {
                    setStatus(response.status);
                    setStatusText(response.statusText);
                    return response.json();
                })
                .then((data) => setUsers(data));
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
                        <Link className="btn btn-success" to={`/create-user`}>
                            <BsFillPersonPlusFill/>
                        </Link>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                users.map( user => {
                                    return (
                                        <tr key={user.id}>
                                            <td>
                                                <p>{user.firstname}</p>
                                                <p>{user.email}</p>
                                            </td>
                                            <td>
                                                <Link className="btn btn-primary" to={`/show-user/${user.id}`}>Voir le profil</Link>
                                                <Link className="btn btn-warning" to={`/edit-user/${user.id}`}>
                                                    <BsFillPencilFill/>
                                                </Link>
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