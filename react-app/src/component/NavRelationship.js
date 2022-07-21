import React, {Fragment} from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import {Link} from "react-router-dom";

export default function NavRelationship(){

    return(
        <Fragment>
             <ListGroup>
                <ListGroup.Item>Suggestions</ListGroup.Item>
                <ListGroup.Item>Mes amies</ListGroup.Item>
                <ListGroup.Item>
                    <Link to={'/users/friend-request'}>Mes demandes en attente</Link>
                </ListGroup.Item>
            </ListGroup>
        </Fragment>
    );
}