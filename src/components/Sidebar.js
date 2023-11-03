import React, {useState} from "react";
import "../App.css";
import {SidebarData} from "./SidebarData";
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Upload from './Upload';
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import FileUploadIcon from '@mui/icons-material/FileUpload';




function Sidebar({setActiveTab}) {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleSidebarItemClick = (index) => {
        setActiveTab(index);
        setSelectedTab(index);
    };
    return (
        <div className="Sidebar">
            <ul className="SidebarList">
                <li className={`SidebarRow ${selectedTab === 0 ? 'active' : ''}`} onClick={() => handleSidebarItemClick(0)}>
                    <div className="SidebarIcon"><HomeIcon /></div>
                    <div className="SidebarTitle">Home</div>
                </li>
                <li className={`SidebarRow ${selectedTab === 1 ? 'active' : ''}`} onClick={() => handleSidebarItemClick(1)}>
                    <div className="SidebarIcon"><ArticleIcon /></div>
                    <div className="SidebarTitle">My Documents</div>
                </li>
                <li className={`SidebarRow ${selectedTab === 2 ? 'active' : ''}`} onClick={() => handleSidebarItemClick(2)}>
                    <div className="SidebarIcon"><FolderSharedIcon /></div>
                    <div className="SidebarTitle">Shared Documents</div>
                </li>
                <li className={`SidebarRow ${selectedTab === 3 ? 'active' : ''}`} onClick={() => handleSidebarItemClick(3)}>
                    <div className="SidebarIcon"><FileUploadIcon /></div>
                    <div className="SidebarTitle">Upload New File</div>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar