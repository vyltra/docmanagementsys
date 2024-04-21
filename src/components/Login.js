import React, {Component} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button"
import UserContext from "./UserContext";

// This component generates the Login field

class Login extends Component {

    static contextType = UserContext; // use Context to access userId for logged-in user

    constructor(props) {
        super(props);

        this.state = {
            username: null,
            password: null,
            status: 0,
        };
    }

    // handler to change the username state
    handleUsernameChange = (event) => {
        this.setState({ username: event.target.value });
    }

    // handler to change the password state
    handlePasswordChange = (event) => {
        this.setState({ password: event.target.value });
    }

    // handler to execute API call to check login credentials
    handleSubmit = () => {

        fetch('http://localhost:3001/login', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: this.state.username, password: this.state.password }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
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
                                       color: 'white',
                                   },
                                   '& .MuiInputLabel-root': {
                                       color: 'grey',
                                   },
                                   '& .MuiFilledInput-root': {
                                       backgroundColor: '#282c34',
                                       borderTopLeftRadius: '4px',
                                       borderTopRightRadius: '4px',
                                       width: '20vw',
                                       '&:before': {
                                           borderBottomColor: '#282c34',
                                       },
                                       '&:after': {
                                           borderBottomColor: '#282c34',
                                       },
                                       '&:hover': {
                                           backgroundColor: '#282c34',
                                       },
                                       '&.Mui-focused': {
                                           backgroundColor: '#546e7a',
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
                                       backgroundColor: '#282c34',
                                       borderTopLeftRadius: '4px',
                                       borderTopRightRadius: '4px',
                                       width: '20vw',
                                       '&:before': {
                                           borderBottomColor: '#282c34',
                                       },
                                       '&:after': {
                                           borderBottomColor: '#282c34',
                                       },
                                       '&:hover': {
                                           backgroundColor: '#282c34',
                                       },
                                       '&.Mui-focused': {
                                           backgroundColor: '#546e7a',
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