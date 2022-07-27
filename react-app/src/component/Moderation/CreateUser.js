import React, {Fragment, useCallback, useState} from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import {Link} from "react-router-dom";
import Select from 'react-select';
import {MultiSelect} from "react-multi-select-component";
import Sidebar from "./Sidebar";

const options = [
    {label: "JavaScript", value: "JavaScript"},
    {label: "PHP", value: "PHP"},
    {label: "React", value: "React"},
    {label: "Node", value: "Node"},
];

const optionsisAdmin = [
    {label: "Utilisateur Standard", value: false},
    {label: "Administrateur", value: true},
];

const optionsisActive = [
    {label: "Activer le compte", value: "1"},
    {label: "Désactiver", value: "0"},
];

const request = new XMLHttpRequest();


export default function CreateUser() {

    const [email, setEmail] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [status, setStatus] = useState(0);
    const [isAdmin, setAdmin] = useState(false);
    const [selected, setSelected] = useState([]);
    const [alert, setAlert] = useState(false);
    const [alertShow, setAlertShow] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSave, setAlertSave] = useState(false);

    const save = useCallback(
        () => {
            request.open("POST", 'http://localhost:5000/admin/create-user', false);
            request.setRequestHeader('Accept', 'application/json');
            request.setRequestHeader("Content-type", "application/json");
            request.send(JSON.stringify({
                email: email,
                firstname: pseudo,
                isAdmin: isAdmin,
                status: status,
                technologies: selected
            }));

            if (JSON.parse(request.response).id) {
                setAlertSave(true);
                setAlert(false);
                setAlertShow(false);
                setEmail('');
                setPseudo('');
                setStatus(0);
                setAdmin(false);
                setSelected([]);
            } else if (JSON.parse(request.response).email) {
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
        },
        [selected, email, status, isAdmin, pseudo, alert]
    );

    return (
        <Fragment>
            <Row>
                <Col md={3} xs={2}>
                    <Sidebar/>
                </Col>
                <Col md={9} xs={6}>
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
                            Votre compte a été créé avec succès. Veuillez consulter votre boîte mail pour confirmer
                            votre compte.
                        </Alert> : ''
                    }
                    <div className={"d-flex justify-content-center mt-5"}>
                        <Card style={{width: '25rem'}}>
                            <Card.Body>
                                <Card.Title>Inscription</Card.Title>
                                <div className="input-group mb-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                        }}
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
                                        onChange={(e) => {
                                            setPseudo(e.target.value)
                                        }}
                                        className="form-control"
                                        placeholder="Pseudo"
                                        aria-label="Pseudo"
                                        aria-describedby="basic-addon1"
                                        name="pseudo"
                                    />
                                </div>

                                <Select
                                    options={optionsisActive}
                                    value={status}
                                    onChange={setStatus}
                                    defaultValue="Statut du compte"
                                    className="mb-3"
                                />

                                <Select
                                    options={optionsisAdmin}
                                    value={isAdmin}
                                    onChange={setAdmin}
                                    defaultValue="Rôle du compte"
                                    className="mb-3"
                                />

                                <MultiSelect
                                    options={options}
                                    value={selected}
                                    onChange={setSelected}
                                    labelledBy="Select"
                                />

                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <Button variant="primary" onClick={save}>Enregister l'utilisateur</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Fragment>
    );
}