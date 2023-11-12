import React, {Component} from "react";
import UserContext from "./UserContext";

// user provider wrapper --> Used to access userId as a "global state"

export class UserProvider extends Component {
    render() {
        const { userId, setUserId, children } = this.props;

        const value = {
            userId: userId,
            setUserId: setUserId,
        };

        return (
            <UserContext.Provider value={value}>
                {children}
            </UserContext.Provider>
        );
    }
}
