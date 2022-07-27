import React, {Fragment, useEffect, useState} from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import {Link, useParams} from "react-router-dom";

const request = new XMLHttpRequest();

export default function Login() {
    const params = useParams();

    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alert, setAlert] = useState(false);

    useEffect(() => {
        request.open("PUT", 'http://mlkchess.fr:5000/confirmation', false);
        request.setRequestHeader("Content-type", "application/json");
        request.send(JSON.stringify({
            "token": params.id,
        }));

        if (JSON.parse(request.response).success === true) {
            setAlertSuccess(true);
        }else {
            setAlert(true);
        }
    },
        []
    );

    return (
        <Fragment>
            <Container>
                <Row>
                    <Col>
                        {alertSuccess ?
                            <Alert key="success" variant="success" className="mt-3">
                                Votre compte a été confirmé. Vous pouvez vous connecter.
                            </Alert> : ''
                        }
                        {alert ?
                            <Alert key="danger" variant="danger" className="mt-3">
                                Le lien n'est pas valide.
                            </Alert> : ''
                        }

                        <div className={"d-flex justify-content-center mt-5"}>
                            {!alert && !alertSuccess ?
                                ''
                                : <Button variant="primary" as={Link} to="/">Se connecter</Button>
                            }
                        </div>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}