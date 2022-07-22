import React, {Fragment, useCallback, useEffect, useState} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import NavRelationship from './NavRelationship';



export default function Users() {

    const [users, setUsers] = useState([]);
    const [followers, setFollowers] = useState([]);
   

    useEffect(() => {

        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
                setUsers(JSON.parse(request.responseText));
               
            }
        }
        request.open( "GET", 'http://localhost:5000/users/users', false );
        request.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZmlyc3RuYW1lIjoiT0siLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjU2NDkzMzU3LCJleHAiOjE2ODgwNTA5NTd9.ym_SMV8gM8tTWp1bFTSPaf_DREdhfKTk2gHi72mwfMs');
        request.send();

    }, [followers]);


    const follow = useCallback(
        (user) => {

            const request = new XMLHttpRequest();
            request.open( "POST", `http://localhost:5000/users/follow`, false ); 
            request.setRequestHeader("Content-type", "application/json");
            request.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZmlyc3RuYW1lIjoiT0siLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjU2NDkzMzU3LCJleHAiOjE2ODgwNTA5NTd9.ym_SMV8gM8tTWp1bFTSPaf_DREdhfKTk2gHi72mwfMs');
            request.send(JSON.stringify({
                "follower": 1,
                "following": user.id,
                "status": 0,
               
            }));

            let newFollowers = followers.slice();
            newFollowers.push(user);
            setFollowers(newFollowers);
        },
        [followers]
    );

    return (
        <Fragment>
            <Container>
                <Row className="pt-5">
                    <Col md="3">
                        <NavRelationship/>
                    </Col>
                    <Col>

                    {
                        users.map( user => {
                            return (
                            <div className="d-flex mt-2" key={user.id}> 
                                <span>{user.firstname}</span>
                                <Button className="mx-2" size="sm" onClick={ () => follow(user)}>Follow</Button>
                            </div>
                          
                            );
                        })
                    }
                    </Col>
                </Row>
            </Container>
        </Fragment>

    );
 
}