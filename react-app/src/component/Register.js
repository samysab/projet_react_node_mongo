import React, {Fragment, useCallback, useState} from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import {Link} from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";

const options = [
    { label: "JavaScript", value: "JavaScript" },
    { label: "PHP", value: "PHP" },
    { label: "React", value: "React" },
    { label: "Node", value: "Node" },
];

const request = new XMLHttpRequest();


export default function Register() {

    const [email, setEmail] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selected, setSelected] = useState([]);
    const [alert, setAlert] = useState(false);
    const [alertShow, setAlertShow] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSave, setAlertSave] = useState(false);

    const save = useCallback(
        () => {
            if (password === confirmPassword) {
                request.open("POST", 'http://localhost:5000/register', false);
                request.setRequestHeader("Content-type", "application/json");
                request.send(JSON.stringify({
                    "email": email,
                    "pseudo": pseudo,
                    "password": password,
                    "technologies": selected
                }));

                if (JSON.parse(request.response).id) {
                    setAlertSave(true);
                    setAlert(false);
                    setAlertShow(false);
                    setEmail('');
                    setPseudo('');
                    setPassword('');
                    setConfirmPassword('');
                    setSelected([]);
                }else if (JSON.parse(request.response).email) {
                    setAlert(false);
                    setAlertSave(false);
                    setAlertMessage('Email déjà utilisé');
                    setAlertShow(true);
                } else if (JSON.parse(request.response).password) {
                    setAlert(false);
                    setAlertSave(false);
                    setAlertMessage('Le mot de passe doit contenir au moins 6 caractères');
                    setAlertShow(true);
                } else {
                    setAlert(false);
                    setAlertSave(false);
                    setAlertMessage('Le pseudo doit contenir au moins 2 caractères');
                    setAlertShow(true);
                }
            }else {
                setAlert(true);
            }
        },
        [selected, email, password, confirmPassword, pseudo, alert]
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
                        {alertShow ?
                            <Alert key="danger" variant="danger" className="mt-3">
                                {alertMessage}
                            </Alert> : ''
                        }
                        {alertSave ?
                            <Alert key="success" variant="success" className="mt-3">
                                Votre compte a été créé avec succès. Veuillez consulter votre boîte mail pour confirmer votre compte.
                            </Alert> : ''
                        }
                        <div className={"d-flex justify-content-center mt-5"}>
                            <Card style={{ width: '25rem' }}>
                                <Card.Body>
                                    <Card.Title>Inscription</Card.Title>
                                    <div className="input-group mb-3">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {setEmail(e.target.value)}}
                                            className="form-control"
                                            placeholder="email@mail.com"
                                            aria-label="Email"
                                            aria-describedby="basic-addon1"
                                            name="email"
                                        />
                                    </div>

                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            value={pseudo}
                                            onChange={(e) => {setPseudo(e.target.value)}}
                                            className="form-control"
                                            placeholder="Pseudo"
                                            aria-label="Pseudo"
                                            aria-describedby="basic-addon1"
                                            name="pseudo"
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
                                            name="password"
                                        />
                                    </div>

                                    <div className="input-group mb-3">
                                        <input
                                            type="password"
                                            value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}}
                                            className="form-control"
                                            placeholder="Confirmation du mot de passe"
                                            aria-label="ConfirmPassword"
                                            aria-describedby="basic-addon1"
                                            name="confirmPassword"
                                        />
                                    </div>

                                    <MultiSelect
                                        options={options}
                                        value={selected}
                                        onChange={setSelected}
                                        labelledBy="Select"
                                    />

                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <Button variant="primary" onClick={save}>S'inscrire</Button>
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