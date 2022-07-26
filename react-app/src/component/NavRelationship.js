import React, {Fragment} from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import {Link} from "react-router-dom";

export default function NavRelationship(){

    return(
        <Fragment>
             <ListGroup>
                <ListGroup.Item>
                    <Link to={'/users/users'}>Ajouter un utilisateur</Link>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Link to={'/users/friends'}>Mes amies</Link>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Link to={'/users/friend-request'}>Mes demandes en attente</Link>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Link to={'/users/send-invitation'}>Mes demandes envoyées</Link>
                </ListGroup.Item>
               
            </ListGroup>
        </Fragment>
    );
}