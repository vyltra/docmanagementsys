import React, {Component} from "react";
import Paper from "@mui/material/Paper";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Dropzone from './Dropzone'
import PDFRenderImage from "./PDFRenderImage";




class Upload extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isOpen: true,
            selectedTags: [],
            selectedUsers: [],
            selectedFile: null,
            userInfo: [],
            userTags: [],
            imagePreview: [],
        };

    }

    componentDidMount() {
        fetch('http://localhost:3001/getAllUsers')
            .then((response) => response.json())
            .then((data) => this.setState({ userInfo: data }))
            .catch((error) => console.error('Error: ', error));

        fetch('http://localhost:3001/getUserTags')
            .then((response) => response.json())
            .then((data) => this.setState({ userTags: data }))
            .catch((error) => console.error('Error: ', error));

    }



    handleTagsChange = (event, values) => {
        // Update the state with the selected tags
        this.setState({ selectedTags: values });
    }

    handleUsersChange = (event, values) => {
        // Assuming 'values' is an array of user names and 'this.state.userInfo' is an array of objects with 'id' and 'user_name'
        const selectedUserIds = values.map(userName => {
            // Find the user object in the userInfo array by name
            const user = this.state.userInfo.find(u => u.user_name === userName);
            // Return the user ID, or null if not found
            return user ? user.id : null;
        }).filter(id => id !== null);

        // Update the state with the selected user IDs
        this.setState({ selectedUsers: selectedUserIds });
    }

    handleFileSelect = (file) => {
        this.setState({ selectedFile: file})
    }

    handleImageReady = (imageData) => {
        this.setState({ imagePreview: imageData });
    }

    handleSubmit = () => { // If you're using this syntax, don't forget to bind it in the constructor or use an arrow function as shown here.
        console.log("Selected Tags:", this.state.selectedTags);
        console.log("Selected Users:", this.state.selectedUsers);
        console.log("Selected File", this.state.selectedFile)

        if (this.state.selectedFile) {

            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result
                    .replace('data:', '')
                    .replace(/^.+,/, '');

                const reqData = {
                    owner: 1, // You need to set this appropriately
                    document: base64String,
                    document_name: this.state.selectedFile.name,
                    tags: this.state.selectedTags, // assuming you want the tag names
                    users: this.state.selectedUsers, // assuming you want the user names
                    image: this.state.imagePreview,
                };

                // Use fetch to send a POST request
                fetch('http://localhost:3001/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reqData), // converts state to json and sends in response body
                })
                    .then(response => { // handle response
                        // Check if the response is successful
                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Success:', data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            };

            reader.onerror = error => {
                console.error('Error: ', error);
            };

            reader.readAsDataURL(this.state.selectedFile);
        } else {
            console.error('No file selected.');
        }
    }


    render() {
        console.log(this.state.userInfo)
        const {isOpen} = this.state;
        return (
            <div className="UploadContainer">
                <div className="Upload">

                    <Dropzone onDrop={this.handleFileSelect}/>
                    <PDFRenderImage file={this.state.selectedFile} onImageReady={this.handleImageReady} />

                    <div className="UploadParameters">

                        <TextField id="filled-basic" label="Document Name" variant="filled"
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


                    </div>

                    <br/>

                    <div className="UploadParameters">
                        <Autocomplete
                            multiple
                            id="tags-filled"
                            options={this.state.userTags.map((option) => option.tag_name)}
                            freeSolo
                            onChange={this.handleTagsChange}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        variant="outlined"
                                        label={option}
                                        {...getTagProps({ index })}
                                        sx={{
                                            '& .MuiChip-label': { // Target the label class within the Chip
                                                color: 'white', // Set the color to white
                                            },
                                            // Add more styling for the Chip if necessary
                                        }}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="filled"
                                    label="Tags"
                                    placeholder="Add Tags here"
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
                            )}
                        />
                        </div>

                    <br/>

                    <div className="UploadParameters">
                        <Autocomplete
                            multiple
                            id="users-filled"
                            options={this.state.userInfo.map((option) => option.user_name)}
                            freeSolo
                            onChange={this.handleUsersChange}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        variant="outlined"
                                        label={option}
                                        {...getTagProps({ index })}
                                        sx={{
                                            '& .MuiChip-label': { // Target the label class within the Chip
                                                color: 'white', // Set the color to white
                                            },
                                            // Add more styling for the Chip if necessary
                                        }}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="filled"
                                    label="Users"
                                    placeholder="Add Users here"
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
                            )}
                        />

                    </div>

                    <Button variant="contained" size="large" onClick={this.handleSubmit}>
                        Submit
                    </Button>

                </div>
            </div>
        )


    }


}

export default Upload