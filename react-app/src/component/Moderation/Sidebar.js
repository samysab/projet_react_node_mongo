import React from 'react';
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
    } from 'cdbreact';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
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
                        Sidebar Footer
                    </div>
                </CDBSidebarFooter>
            </CDBSidebar>
        </div>
    );
};

export default Sidebar;