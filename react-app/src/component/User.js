import React, {Fragment, useCallback, useEffect, useState} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import NavRelationship from './NavRelationship';
import Table from 'react-bootstrap/Table';
import { Link, useParams } from "react-router-dom";
import Card from 'react-bootstrap/Card';




export default function User() {

    const params = useParams();
    const [user, setUser] = useState([]);
    const [following, setFollowing] = useState([]);
    const [follower, setFollower] = useState([]);

    const [action, setAction] = useState(null);
    
    useEffect(() => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
                setUser(JSON.parse(request.responseText));
                setFollowing(JSON.parse(request.responseText));
            }
        }
        request.open( "GET", `http://localhost:5000/users/user/following/${params.id}`, false );
        request.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZmlyc3RuYW1lIjoiT0siLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjU2NDkzMzU3LCJleHAiOjE2ODgwNTA5NTd9.ym_SMV8gM8tTWp1bFTSPaf_DREdhfKTk2gHi72mwfMs');
        request.send();
    }, [action]);

    useEffect(() => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
                setFollower(JSON.parse(request.responseText));
            }
        }
        request.open( "GET", `http://localhost:5000/users/user/follower/${params.id}`, false );
        request.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZmlyc3RuYW1lIjoiT0siLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjU2NDkzMzU3LCJleHAiOjE2ODgwNTA5NTd9.ym_SMV8gM8tTWp1bFTSPaf_DREdhfKTk2gHi72mwfMs');
        request.send();
    }, [action]);

    const accept = useCallback ( (id) =>{

        const request = new XMLHttpRequest();
        request.open( "PUT", `http://localhost:5000/users/friend-request/accept/${id}`, false ); 
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZmlyc3RuYW1lIjoiT0siLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjU2NDkzMzU3LCJleHAiOjE2ODgwNTA5NTd9.ym_SMV8gM8tTWp1bFTSPaf_DREdhfKTk2gHi72mwfMs');
        request.send();

        setAction("ACCEPT");

    },[]);

    const refuse = useCallback ( (id) => {
        const request = new XMLHttpRequest();
        request.open( "PUT", `http://localhost:5000/users/friend-request/refuse/${id}`, false ); 
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZmlyc3RuYW1lIjoiT0siLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjU2NDkzMzU3LCJleHAiOjE2ODgwNTA5NTd9.ym_SMV8gM8tTWp1bFTSPaf_DREdhfKTk2gHi72mwfMs');
        request.send();

        setAction("REFUSE");

    },[]);

    const follow = useCallback( () => {

        const request = new XMLHttpRequest();
        request.open( "POST", `http://localhost:5000/users/follow`, false ); 
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZmlyc3RuYW1lIjoiT0siLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjU2NDkzMzU3LCJleHAiOjE2ODgwNTA5NTd9.ym_SMV8gM8tTWp1bFTSPaf_DREdhfKTk2gHi72mwfMs');
        request.send(JSON.stringify({
            "follower": 1,
            "following": user[0]?.id,
            "status": 0,
        }));

        setAction("FOLLOW");


    },[user]);
    
    const FollowOrUnfollow = useCallback( () => {

      
        if ( following[0]?.following[0]?.relationship.status == 1 ||
             follower[0]?.follower[0]?.relationship.status == 1
        ){
            return (
                <Button className="btn btn-danger btn-sm">Ne plus suivre</Button>
            );
        }
        if (following[0]?.following[0]?.relationship.status == 0){
            return (
                <div>
                    <Button onClick={ () => accept(following[0]?.following[0]?.relationship.id)} className="btn btn-primary btn-sm">Accepter</Button>
                    <Button onClick={ () => refuse(following[0]?.following[0]?.relationship.id)} className="btn btn-danger btn-sm mx-2">Refuser</Button>
                </div>
            );
        }

        if (follower[0]?.follower[0]?.relationship.status == 0){
            return (
                <div>
                    <p>Demande d'ami envoyé.</p>
                </div>

            );
        }
        return (
            <Button onClick={ () => follow()} className="btn btn-primary btn-sm">Suivre</Button>
        );
    },[following, follower]);
  

    return (
        <Fragment>
            <Container>
                <Row className="pt-5">
                    <Col md="3">
                        <NavRelationship/>
                    </Col>
                    <Col>
                        <Card style={{ width: '50rem' }}>
                            <Card.Body>
                                <Card.Title>{ user[0]?.firstname}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{user[0]?.email}</Card.Subtitle>
                                
                                <FollowOrUnfollow/>
                               
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>

    );
 
}