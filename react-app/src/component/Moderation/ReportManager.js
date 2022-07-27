import React, {Fragment, useCallback, useEffect, useState} from "react";
import Sidebar from "./Sidebar";
import Cookies from "universal-cookie";
import {Button, Col, Container, Row, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import {BsFillPersonXFill, BsFillTrashFill, BsTelegram} from "react-icons/bs";

export default function ReportManager() {

    const [reports, setReports] = useState([]);
    const cookies = new Cookies();

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
            fetch(`http://localhost:5000/admin/reports`, myInit)
                .then((response) => {
                    return response.json();
                })
                .then((data) => setReports(data));
        };
        fetchData();
    }, []);


    const deleteReport = useCallback((id) => {
        myHeaders.set('Accept', 'application/json');
        myHeaders.set('Content-Type', 'application/json');
        const deleteReportHeaders = {
            method: 'PUT',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify({status: "-1"})
        };
        const deleteReport = () => {
            fetch(`http://localhost:5000/admin/delete-report/${id}`, deleteReportHeaders)
                .then(res => res.json())

        }
        deleteReport();
    }, []);

    return (
        <Fragment>
            <Container className="m-0">
                <Row>
                    <Col className={"p-0"} md={3}>
                        <Sidebar/>
                    </Col>
                    <Col md={9}>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                reports.map(report => {
                                    console.log(reports)
                                    return (

                                        <tr key={report.id}
                                            className={report.status === 0 ? "alert alert-warning" : "alert alert-danger"}>
                                            <td>
                                                <p>{report.id}</p>
                                                <p>{report.userId}</p>
                                            </td>
                                            <td>
                                                <Button onClick={() => deleteReport(report.id)} className="btn btn-danger">
                                                    <BsFillTrashFill/>
                                                </Button>
                                            </td>
                                        </tr>

                                    );
                                })
                            }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}