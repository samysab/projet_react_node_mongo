import React, {Fragment, useState} from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Link} from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";

const options = [
    { label: "JavaScript", value: "JavaScript" },
    { label: "PHP", value: "PHP" },
    { label: "React", value: "React" },
    { label: "Node", value: "Node" },
];

export default function Profile() {

    const [selected, setSelected] = useState([]);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <Fragment>
            <Container>
                <Row>
                    <Col>
                        <div className={"d-flex justify-content-center mt-5"}>
                            <Card body style={{ width: '100%' }}>
                                <h1>Profile</h1>

                                <Row>
                                    <Col lg={6}>
                                        <p>Mes technologies préférées :</p>
                                        <MultiSelect
                                            options={options}
                                            value={selected}
                                            onChange={setSelected}
                                            labelledBy="Select"
                                        />
                                    </Col>
                                    <Col lg={6}>
                                        <p>Changement du mot de passe :</p>

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

                                        <Button variant="primary">Sauvegarder</Button>
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