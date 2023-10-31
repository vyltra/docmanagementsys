import './App.css';
import Sidebar from "./components/Sidebar";
import DocView from "./components/DocView";
import {RemoveScrollBar} from 'react-remove-scroll-bar';

function App() {

    return <div className="App">
        <Sidebar />
        <DocView />
        <RemoveScrollBar />
    </div>
}

export default App;
