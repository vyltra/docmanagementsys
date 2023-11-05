import './App.css';
import Sidebar from "./components/Sidebar";
import DocView from "./components/DocView";
import {RemoveScrollBar} from 'react-remove-scroll-bar';
import Upload from "./components/Upload";
import React, { useState } from 'react';
import UserContext from "./components/UserContext";
import Login from "./components/Login";
import {UserProvider} from "./components/UserProvider";

function App() {
    const [activeTab, setActiveTab] = useState(0);
    const [userId, setUserId] = useState(null);

    const handleActiveTabChange = (index) => {
        setActiveTab(index);
    };

    const logout = () => {
      setUserId(null);
      setActiveTab(0)
    };

    return (
        <UserProvider userId={userId} setUserId={setUserId}>
            {userId === null && <Login />}
            {userId != null &&
                <div className="App">
                    <RemoveScrollBar />

                    <Sidebar setActiveTab={handleActiveTabChange} logout={logout}/>
                    {(activeTab === 1 || activeTab === 2) && <DocView />}
                    {activeTab === 3 && <Upload />}
                </div>
            }
        </UserProvider>
    );
}

export default App;


