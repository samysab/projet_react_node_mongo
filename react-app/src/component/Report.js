import React, {Fragment, useEffect, useCallback, useState} from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import { useParams} from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Cookies from 'universal-cookie';
import { useAuth } from './auth';

const request = new XMLHttpRequest();

const reasons = [
    { label: "Harcèlement", value: "Harcèlement" },
    { label: "Faux profile", value: "Faux profile" },
    { label: "Message inapproprié", value: "Message inapproprié" },
];


export default function Report() {
    
    const auth = useAuth()
    const params = useParams();
    const [description, setDescription] = useState('');
    const [reason, setReason] = useState('Harcèlement');
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [alertDanger, setAlertDanger] = useState(false);
    const cookies = new Cookies();


    useEffect( () =>{

        request.open("GET", `http://mlkchess.fr:5000/users/user/${params.id}`, false);
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
        request.send();

        if (JSON.parse(request.response).success === false) {
            window.location.href = "/users/users"
        }else{
            if (JSON.parse(request.response).id == auth.user.id){
                window.location.href = "/users/users"
            }
        }

    },[]);

    const save = useCallback( () => {
    
        if (["Harcèlement", "Faux profile","Message inapproprié"].includes(reason) && description != ""){
           
            request.open("POST", 'http://mlkchess.fr:5000/users/report', false);
            request.setRequestHeader("Content-type", "application/json");
            request.setRequestHeader('Authorization', "Bearer " + cookies.get('token'));
            request.send(JSON.stringify({
                "reason": reason,
                "description": description,
                "userId": params.id,
                "status" : 0
            }));

            if (JSON.parse(request.response).success === true) {
                setAlertSuccess(true);
            }else {
                setAlertDanger(true);
            }
        }

    }, [reason, description])

    return (
        <Fragment>
            <Container>
                <Row>
                    <Col>

                    {alertSuccess ?
                            <Alert key="success" variant="success" className="mt-3">
                                L'utilisateur a bien été reporté !
                            </Alert> : ''
                        }
                        {alertDanger ?
                            <Alert key="danger" variant="danger" className="mt-3">
                                Une erreur est survenue !
                            </Alert> : ''
                        }
                    <div className={"d-flex justify-content-center mt-5"}>
                            <Card style={{ width: '25rem' }}>
                                <Card.Body>
                                    <Card.Title className="text-center mb-3">Signaler</Card.Title>
                                    
                                
                                    <Form.Select className="mb-3 "  
                                        value={reason}
                                        onChange={(e) => {setReason(e.target.value)}}>

                                        {
                                            reasons.map( (reason, index) => {
                                                return (
                                                    <option 
                                                        key={index} 
                                                        value={reason.value}>{
                                                            reason.label}
                                                        </option>
                                                );
                                            })
                                        }
                                    </Form.Select>
                                        
                                

                                    <div className="input-group mb-3">
                                        <textarea
                                            value={description}
                                            onChange={(e) => {setDescription(e.target.value)}}
                                            className="form-control"
                                            placeholder="Description"
                                            aria-label="Description"
                                            aria-describedby="basic-addon1"
                                            name="description"
                                        />
                                    </div>

                                   
                                    <Button variant="primary" size="sm" onClick={save}>Signaler</Button>
                                   

                        
                            
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}