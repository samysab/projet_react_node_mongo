import React, {Fragment, useCallback, useEffect, useState} from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavRelationship from './NavRelationship';
import Table from 'react-bootstrap/Table';

export default function Friends() {

    const [friends, setFriends] = useState([]);
    useEffect( () => {

        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
                setFriends(JSON.parse(request.responseText)[0].following);
            }
        }
        request.open( "GET", 'http://localhost:5000/users/friends', false );
        request.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZmlyc3RuYW1lIjoiT0siLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjU2NDkzMzU3LCJleHAiOjE2ODgwNTA5NTd9.ym_SMV8gM8tTWp1bFTSPaf_DREdhfKTk2gHi72mwfMs');
        request.send();

    }, []);

    console.log(friends);
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
                                                    <Button size="sm" className="btn-danger">Supprimer</Button>
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