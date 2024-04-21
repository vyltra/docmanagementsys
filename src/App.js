import './App.css';
import Sidebar from "./components/Sidebar";
import DocView from "./components/DocView";
import {RemoveScrollBar} from 'react-remove-scroll-bar';
import Upload from "./components/Upload";
import React, { useState } from 'react';
import Login from "./components/Login";
import {UserProvider} from "./components/UserProvider";
import Home from "./components/Home";

// main App component. Is the entry point for the application

function App() {
    // activeTab = selected Tab in the Sidebar, stored in App component to act as a global variable
    // userId = ID of the currently logged-in user, stored in App component to act as a global variable
    const [activeTab, setActiveTab] = useState(0);
    const [userId, setUserId] = useState(null);

    // handler for changing Tabs in the Sidebar
    const handleActiveTabChange = (index) => {
        setActiveTab(index);
    };

    // handler for logout
    const logout = () => {
      setUserId(null);
      setActiveTab(0)
    };

    // return uses conditional rendering to show the requested component in the main window
    // requested component is identified by the selected active tab ID
    return (
        <UserProvider userId={userId} setUserId={setUserId}>
            {userId === null && <Login />}
            {userId != null &&
                <div className="App">
                    <RemoveScrollBar />
                    <Sidebar setActiveTab={handleActiveTabChange} logout={logout}/>
                    {activeTab === 0 && <Home />}
                    {(activeTab === 1 || activeTab === 2 || activeTab === 4) && <DocView activeTab={activeTab} />}
                    {activeTab === 3 && <Upload />}
                </div>
            }
        </UserProvider>
    );
}

export default App;


