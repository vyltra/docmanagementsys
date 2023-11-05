import './App.css';
import Sidebar from "./components/Sidebar";
import DocView from "./components/DocView";
import {RemoveScrollBar} from 'react-remove-scroll-bar';
import Upload from "./components/Upload";
import React, { useState } from 'react';
import PDFViewer from "./components/PDFViewer";

function App() {
    const [activeTab, setActiveTab] = useState(0);

    const handleActiveTabChange = (index) => {
        setActiveTab(index);
    };




    return (
        <div className="App">
            <RemoveScrollBar />

            <Sidebar setActiveTab={handleActiveTabChange} />
            {(activeTab === 1 || activeTab === 2) &&<DocView />}
            {activeTab === 3 && <Upload />}
        </div>
    );
}

export default App;
