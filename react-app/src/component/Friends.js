import React, {Fragment, useCallback, useEffect, useState} from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavRelationship from './NavRelationship';
import Table from 'react-bootstrap/Table';
import Cookies from 'universal-cookie';
import Modal from 'react-bootstrap/Modal';
import { Link } from "react-router-dom";
export default function Friends() {
    
    const cookies = new Cookies();
    const [friends, setFriends] = useState([]);

    useEffect( () => {

        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
                setFriends(JSON.parse(request.responseText)[0].following);
            }
        }
        request.open( "GET", 'http://mlkchess.fr:5000/users/friends', false );
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();

    }, []);

    return (
        <Fragment>
            <Container>
                <Row className="pt-5">
                    <Col md="3">
                        <NavRelationship/>
                    </Col>
                    <Col>
                        <h1>Mes amies</h1>

                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th>Nom</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    friends.map( (user,i) =>{
                                        return(
                                            <tr key={user.id}>
                                                <td>{user.firstname}</td>
                                                <td>
                                                    <Link className="btn btn-danger" to={`/users/report/user/${user.id}`}>Signaler</Link>
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