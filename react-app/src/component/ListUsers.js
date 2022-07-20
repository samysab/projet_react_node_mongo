import React, {Fragment, useEffect, useState} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

const request = new XMLHttpRequest();

export default function ListUsers() {

    const [users, setUsers] = useState([]);

    useEffect(() => {

        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
                setUsers(JSON.parse(request.responseText));
               
            }
        }
        request.open( "GET", 'http://localhost:5000/users/users', false );
        request.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZmlyc3RuYW1lIjoiT0siLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjU2NDkzMzU3LCJleHAiOjE2ODgwNTA5NTd9.ym_SMV8gM8tTWp1bFTSPaf_DREdhfKTk2gHi72mwfMs');
        request.send();

    }, []);

   

    return (
        <Fragment>
            <Container>
                <Row>
                    <h1>Liste des utilisateurs</h1>

                    {
                        users.map( user => {
                            return (
                            <div className="d-flex" key={user.id}> 
                                <li>{user.firstname}</li>
                                <Button>Follow</Button>
                            </div>
                          
                            );
                        })
                    }
                </Row>
            </Container>
        </Fragment>

    );
 
}