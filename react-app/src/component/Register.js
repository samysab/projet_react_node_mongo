import React, {Fragment, useState} from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Link} from "react-router-dom";

export default function Register() {

    const [email, setEmail] = useState('');

    return (
        <Fragment>
            <Container>
                <Row>
                    <Col>
                        <div className={"d-flex justify-content-center mt-5"}>
                            <Card style={{ width: '25rem' }}>
                                <Card.Body>
                                    <Card.Title>Inscription</Card.Title>
                                    <div className="input-group mb-3">
                                        <input type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} className="form-control" placeholder="email@mail.com" aria-label="Email" aria-describedby="basic-addon1"/>
                                    </div>

                                    <div className="input-group mb-3">
                                        <input type="password" className="form-control" placeholder="*******" aria-label="Password" aria-describedby="basic-addon1"/>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <Button variant="primary">S'inscrire</Button>
                                        <Link to={'/'}>Connexion</Link>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}