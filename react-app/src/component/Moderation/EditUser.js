import React, {Fragment, useCallback, useEffect, useState} from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {MultiSelect} from "react-multi-select-component";
import Cookies from 'universal-cookie';
import Alert from "react-bootstrap/Alert";
import {useAuth} from '../auth';
import Sidebar from "./Sidebar";
import {useParams} from "react-router-dom";


const options = [
    {label: "JavaScript", value: "JavaScript"},
    {label: "PHP", value: "PHP"},
    {label: "React", value: "React"},
    {label: "Node", value: "Node"},
];

const request = new XMLHttpRequest();

export default function EditUser() {

    const cookies = new Cookies();
    const auth = useAuth();

    const [selected, setSelected] = useState([]);
    const [user, setUser] = useState([]);
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alert, setAlert] = useState(false);
    const [alertReset, setAlertReset] = useState(false);
    const [alertError, setAlertError] = useState(false);
    const params = useParams();
    const myHeaders = new Headers();

    myHeaders.set('Authorization', "Bearer " + cookies.get('token'));

    const myInit = {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };

    useEffect(() => {
        const fetchData = () => {
            fetch(`http://localhost:5000/admin/show-user/${params.id}`, myInit)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    setUser(data);
                });
        };
        fetchData();
    }, []);



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
                } else {
                    setAlertError('Le mot de passe doit contenir au moins 6 caractères');
                    setAlertReset(false);
                    setAlert(false);
                }
            } else {
                setAlert(false);
                setAlertReset(false);
                setAlertError('Les mots de passe ne correspondent pas');
            }
        },
        [password, confirmPassword]
    );

    return (
        <Fragment>
            <Row>
                <Col md={3}>
                    <Sidebar/>
                </Col>
                <Col md={9}>
                    {alert ?
                        <Alert key="success" variant="success" className="mt-3">
                            Le profil a bien été mis à jour
                        </Alert> : ''
                    }
                    {alertError ?
                        <Alert key="danger" variant="danger" className="mt-3">
                            {alertError}
                        </Alert> : ''
                    }
                    {alertReset ?
                        <Alert key="success" variant="success" className="mt-3">
                            Le mot de passe a été changé
                        </Alert> : ''
                    }
                    <div className={"d-flex justify-content-center mt-5"}>
                        <Card body style={{width: '100%'}}>
                            <h1>Profil</h1>

                            <Row>
                                <Col lg={6}>
                                    <label htmlFor="pseudo" className="mt-5 mb-3">Pseudo</label>

                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            value={user.firstname}
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

                                    <label className="mb-3">Mes technologies préférées :</label>

                                    <MultiSelect
                                        options={options}
                                        value={selected}
                                        onChange={setSelected}
                                        labelledBy="Select"
                                    />

                                    <Button variant="primary" onClick={() => {}} className="mt-3">Sauvegarder</Button>
                                </Col>
                                <Col lg={6}>
                                    <p className="mt-5">Changement du mot de passe :</p>

                                    <div className="input-group mb-3">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value)
                                            }}
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
                                            value={confirmPassword} onChange={(e) => {
                                            setConfirmPassword(e.target.value)
                                        }}
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
        </Fragment>
    );
}