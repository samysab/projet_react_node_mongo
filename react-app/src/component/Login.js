import React, {Fragment, useCallback, useState} from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import {Link} from "react-router-dom";
import Cookies from 'universal-cookie';


const request = new XMLHttpRequest();

export default function Login() {

    const [email, setEmail] = useState('');
    const [emailReset, setEmailReset] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState(false);
    const [alertReset, setAlertReset] = useState(false);
    const [alertResetError, setAlertResetError] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const login = useCallback(
        () => {
            request.open("POST", 'http://localhost:5000/login', false); //false for synchronous request
            request.setRequestHeader("Content-type", "application/json");
            request.send(JSON.stringify({
                "email": email,
                "password": password,
            }));

            if (request.response !== 'OK') {
                if (JSON.parse(request.response).success === false) {
                    setAlert(true);
                    setAlertReset(false);
                    setAlertResetError(false);
                    return;
                }
            }

            const cookies = new Cookies();
            cookies.set('token', JSON.parse(request.response).token, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7,
            });
        },
        [email, password]
    );

    const reset = useCallback(
        () => {
            request.open("POST", 'http://localhost:5000/reset', false); //false for synchronous request
            request.setRequestHeader("Content-type", "application/json");
            request.send(JSON.stringify({
                "email": emailReset,
            }));

            handleClose();

            if (JSON.parse(request.response).success === true) {
                setAlertReset(true);
                setAlert(false);
                setAlertResetError(false);
            }else {
                setAlertResetError(true);
                setAlertReset(false);
                setAlert(false);
            }
        },
        [emailReset]
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
                        {alertResetError ?
                            <Alert key="danger" variant="danger" className="mt-3">
                                Ce compte n'existe pas
                            </Alert> : ''
                        }
                        {alertReset ?
                            <Alert key="success" variant="success" className="mt-3">
                                Un email de réinitialisation de mot de passe vous a été envoyé.
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

                                    <div className="d-flex justify-content-center align-items-center">
                                        <Button variant="primary" onClick={login}>Se connecter</Button>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <p className="nav-link mb-0" onClick={handleShow}>Mot de passe oublié</p>
                                        <Link to={'/register'} className="nav-link">Inscription</Link>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Réinitialisation du mot de passe</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="input-group mb-3">
                                        <input
                                            type="email"
                                            value={emailReset}
                                            onChange={(e) => {setEmailReset(e.target.value)}}
                                            className="form-control"
                                            placeholder="Email"
                                            aria-label="EmailReset"
                                            aria-describedby="basic-addon1"
                                        />
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Fermer
                                    </Button>
                                    <Button variant="primary" onClick={reset}>
                                        Réinitialiser
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}