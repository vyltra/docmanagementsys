import React from "react";
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

export const SidebarData = [
    {
        title: "Home",
        icon: <HomeIcon />,
        link: "/home"
    },
    {
        title: "My Documents",
        icon: <ArticleIcon />,
        link: "/mydocuments"
    },
    {
        title: "Shared Documents",
        icon: <FolderSharedIcon />,
        link: "/shareddocuments"
    },
    {
        title: "Upload New File",
        icon: <FolderSharedIcon />,

    }
]
