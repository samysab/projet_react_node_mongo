import React, {Fragment, useCallback, useState} from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import {Link, useParams} from "react-router-dom";

const request = new XMLHttpRequest();

export default function Reset() {
    const params = useParams();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alert, setAlert] = useState(false);
    const [alertSave, setAlertSave] = useState(false);
    const [alertError, setAlertError] = useState(false);

    const save = useCallback(
        () => {
            if (password === confirmPassword) {
                request.open("PUT", 'http://localhost:5000/resetPassword', false);
                request.setRequestHeader("Content-type", "application/json");
                request.send(JSON.stringify({
                    "password": password,
                    "token": params.id
                }));

                if (JSON.parse(request.response).success === true) {
                    setAlertSave(true);
                    setAlertError(false);
                    setAlert(false);
                }else {
                    setAlertError(true);
                    setAlertSave(false);
                    setAlert(false);
                }
            }else {
                setAlert(true);
                setAlertSave(false);
                setAlertError(false);
            }
        },
        [password, confirmPassword]
    );

    return (
        <Fragment>
            <Container>
                <Row>
                    <Col>
                        {alert ?
                            <Alert key="danger" variant="danger" className="mt-3">
                                Les mots de passe ne correspondent pas
                            </Alert> : ''
                        }
                        {alertError ?
                            <Alert key="danger" variant="danger" className="mt-3">
                                Le mot de passe doit contenir au moins 6 caractères.
                                <br/>
                                Ou le lien de réinitialisation est expiré.
                            </Alert> : ''
                        }
                        {alertSave ?
                            <Alert key="success" variant="success" className="mt-3">
                                Votre mot de passe a été modifié
                            </Alert> : ''
                        }
                        <div className={"d-flex justify-content-center mt-5"}>
                            <Card style={{ width: '25rem' }}>
                                <Card.Body>
                                    <Card.Title>Réinitialisation du mot de passe</Card.Title>
                                    <div className="input-group mb-3">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => {setPassword(e.target.value)}}
                                            className="form-control"
                                            placeholder="Nouveau mot de passe"
                                            aria-label="Password"
                                            aria-describedby="basic-addon1"
                                        />
                                    </div>

                                    <div className="input-group mb-3">
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => {setConfirmPassword(e.target.value)}}
                                            className="form-control"
                                            placeholder="Mot de passe de confirmation"
                                            aria-label="PasswordConfirm"
                                            aria-describedby="basic-addon1"
                                        />
                                    </div>

                                    <div className="d-flex justify-content-center align-items-center">
                                        <Button variant="primary" onClick={save}>Réinitialiser</Button>
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