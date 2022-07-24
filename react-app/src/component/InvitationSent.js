import React, {Fragment, useCallback, useEffect, useState} from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavRelationship from './NavRelationship';
import Table from 'react-bootstrap/Table';
import Cookies from 'universal-cookie';

export default function InvitationSent() {

    const cookies = new Cookies();
    const [invitationSent, setInvitationSent] = useState([]);

    useEffect( () => {

        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE) {
                setInvitationSent(JSON.parse(request.responseText));
            }
        }
        request.open( "GET", 'http://localhost:5000/users/invitation-sent', false );
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();

    }, []);

    const StatusMessage = useCallback ((status) => {

      
       if(status.status == 0){
           return (
               <p>Invitation en attente.</p>
           );
       }

        if(status.status == 1){
            return (
                <p>Invitation validée.</p>
            );
        }

        return (
            <p>Invitation refusée.</p>
        );
    
        
    },[]);

    return (
        <Fragment>
            <Container>
                <Row className="pt-5">
                    <Col md="3">
                        <NavRelationship/>
                    </Col>
                    <Col>
                        <h1>Mes demandes envoyées</h1>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th>Nom</th>
                                <th>Date</th>
                                <th>Statut de l'invitation</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                    invitationSent.map( (user,i) =>{
                                        return(
                                            <tr key={user.id}>
                                                <td>{user.firstname}</td>
                                                <td>{user.createdAt}</td>
                                                <td>
                                                    <StatusMessage status={user.status}/>
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