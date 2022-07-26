import React, {useCallback} from 'react';
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
    } from 'cdbreact';
import {NavLink, useNavigate} from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import {useAuth} from "../auth";

const Sidebar = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const logout = useCallback(
        () => {
            auth.logout();
            navigate("/profile", { replace: false });
        },
        []
    );

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
            <CDBSidebar textColor="#fff" backgroundColor="#333">
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                    <a href="/admin" className="text-decoration-none" style={{ color: 'inherit' }}>
                        Admin
                    </a>
                </CDBSidebarHeader>

                <CDBSidebarContent className="sidebar-content">
                    <CDBSidebarMenu>
                        <NavLink to="/admin">
                            <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink to="/admin/manage-user" >
                            <CDBSidebarMenuItem icon="users">Gérer les utilisateurs</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink to="/admin/manage-message" >
                            <CDBSidebarMenuItem icon="comments">Gérer les messages</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink to="/admin/manage-reports">
                            <CDBSidebarMenuItem icon="shield-alt">Gérer les reports</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink to="/profile" >
                            <CDBSidebarMenuItem icon="user">Profile page</CDBSidebarMenuItem>
                        </NavLink>

                    </CDBSidebarMenu>
                </CDBSidebarContent>

                <CDBSidebarFooter style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            padding: '20px 5px',
                        }}
                    >
                            <CDBSidebarMenuItem variant="primary" onClick={logout}>Déconnexion</CDBSidebarMenuItem>
                    </div>
                </CDBSidebarFooter>
            </CDBSidebar>
        </div>
    );
};

export default Sidebar;