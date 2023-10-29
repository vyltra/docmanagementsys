import React from "react";
import "../App.css";
import {SidebarData} from "./SidebarData";

function Sidebar(){
    return(
        <div className="Sidebar">
            <ul className="SidebarList">
                {SidebarData.map((val, key)=> {
                    return (
                        <li className="SidebarRow" key={key}
                            id={window.location.pathname == val.link ? "active" : ""}
                            onClick={()=> {window.location.pathname = val.link}}>
                            <div className="SidebarIcon">{val.icon}</div>
                            <div className="SidebarTitle">{val.title}</div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Sidebar