import React, {Fragment, useCallback, useEffect, useState} from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavRelationship from './NavRelationship';
import Table from 'react-bootstrap/Table';
import Cookies from 'universal-cookie';
import { useAuth } from './auth';

export default function FriendRequest() {
    
    const auth = useAuth()
    const cookies = new Cookies();
    const [friendsRequest, setFriendsRequest] = useState([]);
    

    useEffect( () => {

        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
                setFriendsRequest(JSON.parse(request.responseText)[0].follower);
            }
        }
        request.open( "GET", 'http://mlkchess.fr:5000/users/friend-request', false );
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();

    }, []);

    const accept = useCallback ( (id) =>{


       
        const request = new XMLHttpRequest();
        request.open( "PUT", `http://mlkchess.fr:5000/users/friend-request/accept/${id}`, false );
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();

        let newFriendsRequest = friendsRequest.slice();
        let user = newFriendsRequest.find(user => user.relationship.id == id);
        let index = newFriendsRequest.findIndex(user => user.relationship.id == id);

        request.open( "POST", `http://mlkchess.fr:5000/users/follow`, false );
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send(JSON.stringify({
            "follower": auth.user.id,
            "following": user?.id,
            "status": 1,
        }));

      
        newFriendsRequest.splice(index,1);
        setFriendsRequest(newFriendsRequest);

    },[friendsRequest]);

    const refuse = useCallback ( (id) => {
        const request = new XMLHttpRequest();
        request.open( "PUT", `http://mlkchess.fr:5000/users/friend-request/refuse/${id}`, false );
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();

        let newFriendsRequest = friendsRequest.slice();
        let index = newFriendsRequest.findIndex(user => user.relationship.id == id);
        newFriendsRequest.splice(index,1);
 
        setFriendsRequest(newFriendsRequest);
    },[friendsRequest]);
   

    return (
        <Fragment>
            <Container>
                <Row className="pt-5">
                    <Col md="3">
                        <NavRelationship/>
                    </Col>
                    <Col>
                        <h1>Mes demandes en attente</h1>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th>Nom</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    friendsRequest.map( (user,i) =>{
                                        return(
                                            <tr key={user.id}>
                                                <td>{user.firstname}</td>
                                                <td>
                                                    <Button size="sm" onClick={ () => accept(user.relationship.id)}>Accepter</Button>
                                                    <Button className="btn-danger mx-2" size="sm" onClick={ () => refuse(user.relationship.id)}>Refuser</Button>
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