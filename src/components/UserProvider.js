import React, {Component} from "react";
import UserContext from "./UserContext";

// UserProvider.js

export class UserProvider extends Component {
    render() {
        const { userId, setUserId, children } = this.props;

        // Now we're using the passed down userId and setUserId instead of local state
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
