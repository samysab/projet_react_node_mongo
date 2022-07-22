import React, {Fragment, useCallback, useEffect, useState} from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Link} from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";
import Cookies from 'universal-cookie';
import Alert from "react-bootstrap/Alert";

const options = [
    { label: "JavaScript", value: "JavaScript" },
    { label: "PHP", value: "PHP" },
    { label: "React", value: "React" },
    { label: "Node", value: "Node" },
];

const request = new XMLHttpRequest();

export default function Profile() {

    const cookies = new Cookies();

    const [selected, setSelected] = useState([]);
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alert, setAlert] = useState(false);
    const [alertReset, setAlertReset] = useState(false);
    const [alertError, setAlertError] = useState(false);

    useEffect(() => {
            console.log(cookies.get('token'));
            request.open("GET", 'http://localhost:5000/users/profile', false); //false for synchronous request
            request.setRequestHeader("Content-type", "application/json");
            request.setRequestHeader("Authorization", "Bearer " + cookies.get('token'));
            request.send();

            setPseudo(JSON.parse(request.response).pseudo);
            setSelected(JSON.parse(JSON.parse(request.response).technologies));
        },
        []
    );

    const update = useCallback(
        () => {
            request.open("PUT", 'http://localhost:5000/users/updateProfile', false); //false for synchronous request
            request.setRequestHeader("Content-type", "application/json");
            request.setRequestHeader("Authorization", "Bearer " + cookies.get('token'));
            request.send(JSON.stringify({
                "pseudo": pseudo,
                "technologies": selected
            }));

            if (JSON.parse(request.response).success === true) {
                setAlertReset(false);
                setAlertError(false);
                setAlert(true);
            }else {
                setAlertError('Le pseudo doit contenir au moins 2 caractères');
                setAlertReset(false);
                setAlert(false);
            }
        },
        [pseudo, selected]
    );

    const updatePassword = useCallback(
        () => {
            if (password === confirmPassword) {
                request.open("PUT", 'http://localhost:5000/users/resetPassword', false); //false for synchronous request
                request.setRequestHeader("Content-type", "application/json");
                request.setRequestHeader("Authorization", "Bearer " + cookies.get('token'));
                request.send(JSON.stringify({
                    "password": password,
                }));

                if (JSON.parse(request.response).success === true) {
                    setAlertReset(true);
                    setAlertError(false);
                    setAlert(false);
                }else {
                    setAlertError('Le mot de passe doit contenir au moins 6 caractères');
                    setAlertReset(false);
                    setAlert(false);
                }
            }else {
                setAlert(false);
                setAlertReset(false);
                setAlertError('Les mots de passe ne correspondent pas');
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
                            <Alert key="success" variant="success" className="mt-3">
                                Votre profil a bien été mis à jour
                            </Alert> : ''
                        }
                        {alertError ?
                            <Alert key="danger" variant="danger" className="mt-3">
                                {alertError}
                            </Alert> : ''
                        }
                        {alertReset ?
                            <Alert key="success" variant="success" className="mt-3">
                                Votre mot de passe a été changé
                            </Alert> : ''
                        }
                        <div className={"d-flex justify-content-center mt-5"}>
                            <Card body style={{ width: '100%' }}>
                                <h1>Profile</h1>

                                <Row>
                                    <Col lg={6}>
                                        <label htmlFor="pseudo" className="mt-5 mb-3">Pseudo</label>

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

                                        <label className="mb-3">Mes technologies préférées :</label>

                                        <MultiSelect
                                            options={options}
                                            value={selected}
                                            onChange={setSelected}
                                            labelledBy="Select"
                                        />

                                        <Button variant="primary" onClick={update} className="mt-3">Sauvegarder</Button>
                                    </Col>
                                    <Col lg={6}>
                                        <p className="mt-5">Changement du mot de passe :</p>

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

                                        <Button variant="primary" onClick={updatePassword}>Changer</Button>
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}