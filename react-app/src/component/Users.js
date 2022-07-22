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



export default function Users() {

    const [users, setUsers] = useState([]);
    const [value, setValue] = useState("");
    
   

    useEffect(() => {

        if (value == ""){
            const request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (request.readyState == XMLHttpRequest.DONE) {
                    setUsers(JSON.parse(request.responseText));
                
                }
            }
            request.open( "GET", 'http://localhost:5000/users/users', false );
            request.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZmlyc3RuYW1lIjoiT0siLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjU2NDkzMzU3LCJleHAiOjE2ODgwNTA5NTd9.ym_SMV8gM8tTWp1bFTSPaf_DREdhfKTk2gHi72mwfMs');
            request.send();
        }else{
            const request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (request.readyState == XMLHttpRequest.DONE) {
                    setUsers(JSON.parse(request.responseText));
                }
            }
            request.open( "GET", `http://localhost:5000/users/search/${value}`, false ); 
            request.setRequestHeader("Content-type", "application/json");
            request.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZmlyc3RuYW1lIjoiT0siLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjU2NDkzMzU3LCJleHAiOjE2ODgwNTA5NTd9.ym_SMV8gM8tTWp1bFTSPaf_DREdhfKTk2gHi72mwfMs');
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
                                            <p>{user.following.id}</p>
                                        </td>
                                        <td>
                                            <Button size="sm">Voir le profile</Button>
                                            <Link to={'/users/user/1'}></Link>
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