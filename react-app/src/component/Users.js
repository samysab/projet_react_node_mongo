import React, {Fragment, useCallback, useEffect, useState} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import NavRelationship from './NavRelationship';
import Table from 'react-bootstrap/Table';
import { Link } from "react-router-dom";
import Cookies from 'universal-cookie';

export default function Users() {

    const [users, setUsers] = useState([]);
    const [value, setValue] = useState("");
    const cookies = new Cookies();
   

    useEffect(() => {
        
        if (value == ""){
            const request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (request.readyState == XMLHttpRequest.DONE) {
                    setUsers(JSON.parse(request.responseText));
                
                }
            }
            request.open( "GET", 'http://mlkchess.fr:5000/users/users', false );
            request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
            request.send();
        }else{
            const request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (request.readyState == XMLHttpRequest.DONE) {
                    setUsers(JSON.parse(request.responseText));
                }
            }
            request.open( "GET", `http://mlkchess.fr:5000/users/search/${value}`, false );
            request.setRequestHeader("Content-type", "application/json");
            request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
            request.send();
        }
        

    }, [value]);

    const search = useCallback( (event) => {
        setValue(event.target.value);
    },[value])

    return (
        <Fragment>
            <Container>
                <Row className="pt-5">
                    <Col md="3">
                        <NavRelationship/>
                    </Col>
                    <Col>

                    <InputGroup className="mb-3">
                        <Form.Control
                        placeholder="Nom, email"
                        onChange = {search}
                        />
                    </InputGroup>

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
                                            <Link className="btn btn-primary" to={`/users/user/${user.id}`}>Voir le profile</Link>
                                            <Link className="btn btn-danger mx-2" to={`/users/report/user/${user.id}`}>Signaler</Link>
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