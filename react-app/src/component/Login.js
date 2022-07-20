import React, {Fragment, useCallback, useState} from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import {Link} from "react-router-dom";

const request = new XMLHttpRequest();

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState(false);

    const login = useCallback(
        () => {
            request.open("POST", 'http://localhost:5000/login', false); //false for synchronous request
            request.setRequestHeader("Content-type", "application/json");
            request.send(JSON.stringify({
                "email": email,
                "password": password,
            }));

            if (!JSON.parse(request.response).success){
                setAlert(true);
            }
        },
        [email, password]
    );

    return (
        <Fragment>
            <Container>
                <Row>
                    <Col>
                        {alert ?
                            <Alert key="danger" variant="danger" className="mt-3">
                                Mauvais email ou mot de passe
                            </Alert> : ''
                        }
                        <div className={"d-flex justify-content-center mt-5"}>
                            <Card style={{ width: '25rem' }}>
                                <Card.Body>
                                    <Card.Title>Connexion</Card.Title>
                                    <div className="input-group mb-3">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {setEmail(e.target.value)}}
                                            className="form-control"
                                            placeholder="email@mail.com"
                                            aria-label="Email"
                                            aria-describedby="basic-addon1"
                                        />
                                    </div>

                                    <div className="input-group mb-3">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => {setPassword(e.target.value)}}
                                            className="form-control"
                                            placeholder="Mot de passe"
                                            aria-label="Password"
                                            aria-describedby="basic-addon1"
                                        />
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <Button variant="primary" onClick={login}>Se connecter</Button>
                                        <Link to={'/register'}>Inscription</Link>
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