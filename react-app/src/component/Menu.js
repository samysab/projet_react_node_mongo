import React, {Fragment, useCallback} from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link, useNavigate} from "react-router-dom";
import { useAuth } from './auth';

export default function Menu() {
    const auth = useAuth();
    const navigate = useNavigate();

    const logout = useCallback(
        () => {
            auth.logout();
            navigate("/", { replace: false });
        },
        []
    );

    return (
        <Fragment>
            {auth.user && auth.user.success !== false ?
                <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Link to={'/profile'} className={"nav-link"}>Profile</Link>
                            </Nav>
                            <Nav className="me-auto">
                                <Link to={'/users/users'} className={"nav-link"}>Amis</Link>
                            </Nav>
                            <Nav className="me-auto">
                                <Link to={'/messages'} className={"nav-link"}>Messages</Link>
                            </Nav>
                            {auth.user.isAdmin ?
                                <Nav className="me-auto">
                                    <Link to={'/admin'} className={"nav-link"}>Administration</Link>
                                </Nav>
                                : ""
                            }
                            <Navbar.Text>
                                <Button variant="primary" onClick={logout}>Déconnexion</Button>
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                : ''
            }
        </Fragment>
    );
}