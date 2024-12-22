// src/Layout.js
import React, { useState } from 'react';
import Sidebar from './SidebarAdmin';
import Navbar from './NavbarAdmin';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col">
                <Navbar toggleSidebar={toggleSidebar} />
                <div className="p-4">
                </div>
            </div>
        </div>
    );
};

export default Layout;