import React, {Component, useContext} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button"
import { UserProvider } from './UserProvider';
import UserContext from "./UserContext"; // This should be the same UserContext used in UserProvider


class Login extends Component {

    static contextType = UserContext; // Correctly set the contextType

    constructor(props) {
        super(props);

        this.state = {
            username: null,
            password: null,
            status: 0,
        };
    }

    handleUsernameChange = (event) => {
        this.setState({ username: event.target.value });
    }

    handlePasswordChange = (event) => {
        this.setState({ password: event.target.value });
    }

    handleSubmit = () => {
        console.log(this.state.username);
        console.log(this.state.password);

        fetch('http://localhost:3001/login', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: this.state.username, password: this.state.password }), // Assuming the backend expects a JSON with a documentId field
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data.loginGranted)
                if (data.loginGranted){
                    // Access the setUserId function from the context
                    this.context.setUserId(data.user_id);
                } else {
                    this.setState({ status: 1})
                }

            })
            .catch((error) => {
                console.error('Error: ', error);
            });


    }


    render() {
        return (
            <div className="LoginContainer">
                <div className="LoginBox">


                    {this.state.status === 0 &&
                    <h1>Please Log In</h1>
                    }

                    {this.state.status === 1 &&
                        <h1>Invalid Credentials</h1>
                    }


                    <br/>
                    <TextField id="filled-basic" label="Username" variant="filled" onChange={this.handleUsernameChange}
                               sx={{
                                   '& .MuiInputBase-input': {
                                       color: 'white', // Text color
                                   },
                                   '& .MuiInputLabel-root': {
                                       color: 'grey', // Label color
                                   },
                                   '& .MuiFilledInput-root': {
                                       backgroundColor: '#282c34', // Change the background color here
                                       borderTopLeftRadius: '4px', // Round the top corners
                                       borderTopRightRadius: '4px', // Round the top corners
                                       width: '20vw',
                                       '&:before': {
                                           borderBottomColor: '#282c34',
                                       },
                                       '&:after': {
                                           borderBottomColor: '#282c34',
                                       },
                                       '&:hover': {
                                           backgroundColor: '#282c34', // Change the background color on hover (darker shade for example)
                                       },
                                       '&.Mui-focused': {
                                           backgroundColor: '#546e7a', // Change the background color on focus
                                       }
                                   }
                               }}

                    />

                    <br/>
                    <TextField id="filled-basic" label="Password" variant="filled" onChange={this.handlePasswordChange}
                               sx={{
                                   '& .MuiInputBase-input': {
                                       color: 'white', // Text color
                                   },
                                   '& .MuiInputLabel-root': {
                                       color: 'grey', // Label color
                                   },
                                   '& .MuiFilledInput-root': {
                                       backgroundColor: '#282c34', // Change the background color here
                                       borderTopLeftRadius: '4px', // Round the top corners
                                       borderTopRightRadius: '4px', // Round the top corners
                                       width: '20vw',
                                       '&:before': {
                                           borderBottomColor: '#282c34',
                                       },
                                       '&:after': {
                                           borderBottomColor: '#282c34',
                                       },
                                       '&:hover': {
                                           backgroundColor: '#282c34', // Change the background color on hover (darker shade for example)
                                       },
                                       '&.Mui-focused': {
                                           backgroundColor: '#546e7a', // Change the background color on focus
                                       }
                                   }
                               }}

                    />
                    <br/>
                    <Button
                        variant="contained"
                        onClick={this.handleSubmit}
                        sx={{
                            width: '20vw',
                            height: '3vh',
                        }}
                    >
                        Login
                    </Button>
                </div>
            </div>
        );
    }
}

export default Login